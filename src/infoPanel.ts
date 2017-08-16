import { Panel } from './panel';
import { InfoPanelOption } from './interface';
import { util,nextFrame,cancelFrame } from './util';
var prefixes = ["webkit", "moz", "MS", "o"];
class InfoPanel extends Panel implements InfoPanelOption{
    autoRemove = true;
    autoRemoveTime = 2000;
    width = '';
    maxHeight = '';
    _bottom = 0;
    contentElements = [];
    private static startBottom = 5;
    private static instances = [];
    private static margin = 10;
    private static show(option:InfoPanelOption){
        var panel = new InfoPanel(option);
        panel.render();
        return panel;
    }
    static triggerRemoveEvent(){
        util.delayExecute('triggerRemoveInfoPanelEvent', function () {
            var bottom = InfoPanel.startBottom,size;
            InfoPanel.instances.forEach((instance) => {
                instance.updateBottom(bottom);
                size = instance.elementSize(instance.el);
                bottom += size.height + InfoPanel.margin;
            });
        });
    }
    constructor(option:InfoPanelOption){
        super(option);
        this.assignOption(option,['width','maxHeight','autoRemove','autoRemoveTime','contentElements']);
    }
    render(){

        if(InfoPanel.instances.indexOf(this) >= 0){
            return;
        }
        var panel = this.createPanel();
        util.addClass(panel,'h-panel-info');
        util.addClass(panel,'h-visible');
        if(this.width){
            panel.style.width = this.width;
        }
        this.el = panel;

        this.initContentElements();

        if(this.autoRemove){
            this.triggerAutoRemove();
        }

        InfoPanel.instances.push(this);

        this.updatePosition();

        document.body.appendChild(panel);
    }
    protected initContentElements(){
        var panel = this.el;
        this.contentElements.forEach((element) => {
            var nodes = this.parseNode(element);
            nodes.forEach((node) => {
                panel.appendChild(node);
            });
        });
    }
    private updatePosition(){
        var instances = InfoPanel.instances;
        var index = instances.length - 1;
        var bottom = InfoPanel.startBottom,size;
        for(var i = 0;i < index;i++){
            size = this.elementSize(instances[i].el);
            bottom += size.height + InfoPanel.margin;
        }
        this.updateBottom(bottom);

        util.delayExecute('checkInfoPanelOverflow',() => {
            this.checkOverflow();
        });
    }
    private checkOverflow(){
        if(InfoPanel.instances.length === 0){
            return;
        }
        var instances = InfoPanel.instances;
        var clientHeight = window.innerHeight,
            size = this.elementSize(this.el);


        var removedInstances = [];
        var leftHeight = clientHeight - this._bottom;
        var i,_height = leftHeight;
        if(this._bottom + size.height >= clientHeight){
            for(i = 0;i < instances.length;i++){
                _height += this.elementSize(instances[i].el).height;
                removedInstances.push(instances[i]);
                if(_height >= size.height){
                    break;
                }
            }

            instances.splice(0,i + 1);
            InfoPanel.overflowRemove(removedInstances);
        }
    }
    private updateBottom(bottom:number = 0){
        this.el.style.bottom = bottom + 'px';
        this._bottom = bottom;
    }
    private triggerAutoRemove(){
        var onceExecuteFn = this.onceExecute(() => {
            this.remove();
        });
        setTimeout(() => {
            util.removeClass(this.el,'h-visible');
            setTimeout(onceExecuteFn,1300);
            var eventType = 'AnimationEnd';
            prefixes.forEach((prefix) => {
                this.el.addEventListener(prefix + eventType,onceExecuteFn);
            });
        },this.autoRemoveTime);
    }
    static overflowRemove(instances:InfoPanel[]){
        InfoPanel.instances = InfoPanel.instances.filter(function (_instance) {
            return instances.indexOf(_instance) === -1;
        });
        instances.forEach(function (instance) {
            util.removeClass(instance.el,'h-visible');
            setTimeout(() => {
                util.removeElement(instance.el);
            },800);
        });
        InfoPanel.triggerRemoveEvent();
    }
    remove(){
        var index = InfoPanel.instances.indexOf(this);
        if(index >= 0){
            InfoPanel.instances.splice(index,1);
        }
        util.removeElement(this.el);
        InfoPanel.triggerRemoveEvent();
    }
}

export { InfoPanel };