import { Window } from './window';
import { InfoPanelOption,Align } from './interface';
import { util,nextFrame,cancelFrame } from './util';
var prefixes = ["webkit", "moz", "MS", "o"];
var alignClass = {
    [Align.LEFT]:'h-align-left',
    [Align.RIGHT]:'h-align-right',
    [Align.CENTER]:'h-align-center'
};
class InfoWindow extends Window implements InfoPanelOption{
    autoRemove = true;
    autoRemoveTime = 2000;
    css = {};
    _bottom = 0;
    align = Align.RIGHT;
    private static startBottom = 5;
    private static instances = {
        left:[],
        right:[],
        center:[]
    };
    private static show(option:InfoPanelOption){
        var panel = new InfoWindow(option);
        panel.render();
        return panel;
    }
    static triggerRemoveEvent(align = Align.RIGHT){
        util.delayExecute('triggerRemoveInfoPanelEvent', function () {
            var bottom = InfoWindow.startBottom,size;
            InfoWindow.instances[align].forEach((instance) => {
                instance.updateBottom(bottom);
                size = instance.elementSize(instance.el);
                bottom += size.height;
            });
        });
    }
    constructor(option:InfoPanelOption){
        super(option);

        if(option.align in alignClass){
            this.align = option.align;
        }
        this.assignOption(option,['css','autoRemove','autoRemoveTime']);
    }
    protected createWindow(){
        super.createWindow();
        var panel = this.el;
        util.addClass(panel,'h-window-info');
        util.addClass(panel.panel,alignClass[this.align]);
    }
    render(){
        var instances = InfoWindow.instances[this.align];
        if(instances.indexOf(this) >= 0){
            return;
        }
        this.createWindow();

        this.initContentElements();

        if(this.autoRemove){
            this.triggerAutoRemove();
        }

        instances.push(this);

        this.updatePosition();

        this.initStyle();

        document.body.appendChild(this.el);
    }
    protected initStyle(){
        var panel = this.el.panel;
        var style = panel.style;
        Object.keys(this.css).forEach((key) => {
            if(key in style){
                style[key] = this.css[key];
            }
        });
    }
    protected initContentElements(){
        var panel = this.el.panel;
        this.contentElements.forEach((element) => {
            var nodes = this.parseNode(element);
            nodes.forEach((node) => {
                panel.appendChild(node);
            });
        });
    }
    private updatePosition(){
        var instances = InfoWindow.instances[this.align];
        var index = instances.length - 1;
        var bottom = InfoWindow.startBottom,size;
        for(var i = 0;i < index;i++){
            size = this.elementSize(instances[i].el);
            bottom += size.height;
        }
        this.updateBottom(bottom);

        util.delayExecute('checkInfoPanelOverflow',() => {
            this.checkOverflow();
        });
    }
    private checkOverflow(){
        var instances = InfoWindow.instances[this.align];
        if(instances.length === 0){
            return;
        }
        var clientHeight = window['innerHeight'],
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
            InfoWindow.overflowRemove(removedInstances,this.align);
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
    static overflowRemove(removeInstances:InfoWindow[],align = Align.RIGHT){
        var instances = InfoWindow.instances[align];
        InfoWindow.instances[align] = instances.filter(function (_instance) {
            return removeInstances.indexOf(_instance) === -1;
        });
        removeInstances.forEach(function (instance) {
            util.removeClass(instance.el,'h-visible');
            setTimeout(() => {
                util.removeElement(instance.el);
            },800);
        });
        InfoWindow.triggerRemoveEvent(align);
    }
    remove(){
        var instances = InfoWindow.instances[this.align];
        var index = instances.indexOf(this);
        if(index >= 0){
            instances.splice(index,1);
        }
        util.removeElement(this.el);
        InfoWindow.triggerRemoveEvent(this.align);
    }
}

export { InfoWindow };