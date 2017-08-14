import { Dialog } from './dialog';
import { InfoDialogOption } from './interface';
import { util } from './util';
var prefixes = ["webkit", "moz", "MS", "o"];
class InfoDialog extends Dialog implements InfoDialogOption{
    content:String = '';
    autoRemove = true;
    autoRemoveTime = 2000;
    static instances = [];
    static margin = 10;
    static show(option:InfoDialogOption){
        var dialog = new InfoDialog(option);
        dialog.render();
        return dialog;
    }
    static triggerRemoveEvent(){
        var bottom = 0,size;
        InfoDialog.instances.forEach((instance) => {
            instance.updateBottom(bottom);
            size = instance.elementSize(instance.el);
            bottom += size.height + InfoDialog.margin;
        });
    }
    constructor(option:InfoDialogOption){
        super(option);
        this.assignOption(option,['content','autoRemove','autoRemoveTime']);
    }
    render(){

        if(InfoDialog.instances.indexOf(this) >= 0){
            return;
        }

        var panel = this.createPanel();
        util.addClass(panel,'h-dialog-info');
        util.addClass(panel,'h-visible');

        var iconPanel = util.createElement('div');
        util.addClass(iconPanel,'h-dialog-icon');
        var image = util.createElement('div');
        iconPanel.appendChild(image);

        var contentPanel = util.createElement('div');
        util.addClass(contentPanel,'h-dialog-content');
        var textNode = document.createTextNode(this.content);
        contentPanel.appendChild(textNode);

        panel.appendChild(iconPanel);
        panel.appendChild(contentPanel);

        this.parent.appendChild(panel);
        this.el = panel;

        if(this.autoRemove){
            this.triggerAutoRemove();
        }

        InfoDialog.instances.push(this);

        this.updatePosition();
    }
    private updatePosition(){
        var index = InfoDialog.instances.length - 1;
        var bottom = 0,size;
        for(var i = 0;i < index;i++){
            size = this.elementSize(this.el);
            bottom += size.height + InfoDialog.margin;
        }
        this.updateBottom(bottom);
    }
    private updateBottom(bottom:number = 0){
        this.el.style.bottom = bottom + 'px';
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
    remove(){
        var index = InfoDialog.instances.indexOf(this);
        if(index >= 0){
            InfoDialog.instances.splice(index,1);
        }
        this.el.remove();
        InfoDialog.triggerRemoveEvent();
    }
}

export { InfoDialog };