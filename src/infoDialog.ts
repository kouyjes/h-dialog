import { Panel } from './panel';
import { InfoDialogOption,InfoDialogType } from './interface';
import { InfoPanel } from './infoPanel';
import { util,nextFrame,cancelFrame } from './util';
var infoDialogClass = {
    'info':'h-info',
    'warn':'h-warn',
    'error':'h-error'
};
class InfoDialog extends InfoPanel implements InfoDialogOption{
    type = InfoDialogType.INFO;
    content:String = '';
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
        this.assignOption(option,['type','content']);
        this.assignOption(option,['html'],false);
    }
    protected render(){
        var result = super.render();
        var panel = this.el;
        util.addClass(panel,'h-dialog-info');
        util.addClass(panel,infoDialogClass[this.type]);
        return result;
    }
    protected initContentElements(){

        var panel = this.el;
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