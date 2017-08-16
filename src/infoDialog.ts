import { InfoDialogOption,InfoDialogType,Align } from './interface';
import { InfoWindow } from './infoWindow';
import { util,nextFrame,cancelFrame } from './util';
var infoDialogClass = {
    'info':'h-info',
    'warn':'h-warn',
    'error':'h-error'
};
class InfoDialog extends InfoWindow implements InfoDialogOption{
    type = InfoDialogType.INFO;
    content:String = '';
    maxHeight = '';
    html = null;
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
    constructor(option:InfoDialogOption){
        super(option);
        this.assignOption(option,['maxHeight','type','content']);
        this.assignOption(option,['html'],false);
    }
    protected createWindow(){
        super.createWindow();
        var panel = this.el;
        util.addClass(panel,'h-dialog-info');
        util.addClass(panel.panel,infoDialogClass[this.type]);
        return panel;
    }
    protected initContentElements(){

        var panel = this.el.panel;
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
        if(this.html){
            this.parseNode(this.html).forEach((node) => {
                contentPanel.appendChild(node);
            });
        }else{
            let textNode = document.createTextNode(this.content);
            contentPanel.appendChild(textNode);
        }
        if(this.maxHeight){
            contentPanel.style.maxHeight = this.maxHeight;
        }
        panel.appendChild(iconPanel);
        panel.appendChild(contentPanel);

    }
    private bindCloseEvent(el:HTMLElement){
        el.addEventListener('click', () => {
            this.remove();
        });
    }
}

export { InfoDialog };