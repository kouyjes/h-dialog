import { Dialog } from './dialog';
import { InfoDialogOption,InfoDialogType } from './interface';
import { util,nextFrame,cancelFrame } from './util';
var prefixes = ["webkit", "moz", "MS", "o"];
var infoDialogClass = {
    'info':'h-info',
    'warn':'h-warn',
    'error':'h-error'
};
class InfoDialog extends Dialog implements InfoDialogOption{
    type = InfoDialogType.INFO;
    content:String = '';
    autoRemove = true;
    autoRemoveTime = 2000;
    width = '';
    maxHeight = '';
    _bottom = 0;
    static startBottom = 5;
    static instances = [];
    static margin = 10;
    static show(option:InfoDialogOption,type = InfoDialogType.INFO){
        option.type = type;
        var dialog = new InfoDialog(option);
        dialog.render();
        return dialog;
    }
    static info(option:InfoDialogOption){
        return InfoDialog.show(option);
    }
    static warn(option:InfoDialogOption){
        return InfoDialog.show(option,InfoDialogType.WARN);
    }
    static error(option:InfoDialogOption){
        return InfoDialog.show(option,InfoDialogType.ERROR);
    }
    static triggerRemoveEvent(){
        util.delayExecute('triggerRemoveInfoDialogEvent', function () {
            var bottom = InfoDialog.startBottom,size;
            InfoDialog.instances.forEach((instance) => {
                instance.updateBottom(bottom);
                size = instance.elementSize(instance.el);
                bottom += size.height + InfoDialog.margin;
            });
        });
    }
    constructor(option:InfoDialogOption){
        super(option);
        this.assignOption(option,['type','width','maxHeight','content','autoRemove','autoRemoveTime']);
    }
    render(){

        if(InfoDialog.instances.indexOf(this) >= 0){
            return;
        }

        var panel = this.createPanel();
        util.addClass(panel,'h-dialog-info');
        util.addClass(panel,'h-visible');
        util.addClass(panel,infoDialogClass[this.type]);
        if(this.width){
            panel.style.width = this.width;
        }

        var iconPanel = util.createElement('div');
        util.addClass(iconPanel,'h-dialog-icon');
        var image = util.createElement('div');
        util.addClass(image,'h-dialog-image');
        iconPanel.appendChild(image);

        var closeIcon = util.createElement('div');
        util.addClass(closeIcon,'h-dialog-close');
        iconPanel.appendChild(closeIcon);
        this.bindCloseEvent(closeIcon);

        var contentPanel = util.createElement('div');
        util.addClass(contentPanel,'h-dialog-content');
        var textNode = document.createTextNode(this.content);
        contentPanel.appendChild(textNode);
        if(this.maxHeight){
            contentPanel.style.maxHeight = this.maxHeight;
        }

        panel.appendChild(iconPanel);
        panel.appendChild(contentPanel);

        this.el = panel;

        if(this.autoRemove){
            this.triggerAutoRemove();
        }

        InfoDialog.instances.push(this);

        this.updatePosition();

        document.body.appendChild(panel);
    }
    private bindCloseEvent(colseEl:HTMLElement){
        colseEl.addEventListener('click', () => {
            this.remove();
        });
    }
    private updatePosition(){
        var instances = InfoDialog.instances;
        var index = instances.length - 1;
        var bottom = InfoDialog.startBottom,size;
        for(var i = 0;i < index;i++){
            size = this.elementSize(instances[i].el);
            bottom += size.height + InfoDialog.margin;
        }
        this.updateBottom(bottom);

        util.delayExecute('checkInfoDialogOverflow',() => {
            this.checkOverflow();
        });
    }
    private checkOverflow(){
        if(InfoDialog.instances.length === 0){
            return;
        }
        var instances = InfoDialog.instances;
        var clientHeight = window.innerHeight,
            size = this.elementSize(this.el);

        var i,_height = 0;
        var removedInstances = [];
        if(this._bottom + size.height + InfoDialog.margin >= clientHeight){
            for(i = 0;i < instances.length;i++){
                _height += this.elementSize(instances[i].el).height;
                removedInstances.push(instances[i]);
                if(_height >= size.height){
                    break;
                }
            }

            instances.splice(0,i + 1);
            InfoDialog.overflowRemove(removedInstances);
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
    static overflowRemove(instances:InfoDialog[]){
        InfoDialog.instances = InfoDialog.instances.filter(function (_instance) {
            return instances.indexOf(_instance) === -1;
        });
        instances.forEach(function (instance) {
            util.removeClass(instance.el,'h-visible');
            setTimeout(() => {
                util.removeElement(instance.el);
            },800);
        });
        InfoDialog.triggerRemoveEvent();
    }
    remove(){
        var index = InfoDialog.instances.indexOf(this);
        if(index >= 0){
            InfoDialog.instances.splice(index,1);
        }
        util.removeElement(this.el);
        InfoDialog.triggerRemoveEvent();
    }
}

export { InfoDialog };