import { PanelOption } from './interface';
import { util } from './util';
abstract class Panel implements PanelOption{
    el:HTMLElement;
    constructor(option:PanelOption){
    }
    protected elementSize(el:HTMLElement){
        var size = {
            width:el.offsetWidth,
            height:el.offsetHeight
        };
        return size;
    }
    protected assignOption(option:any,keys:String[] = [],matchType = true){
        keys.forEach((key) => {
            if(!matchType || typeof this[key] === typeof option[key]){
                this[key] = option[key];
            }
        });
    }
    protected createPanel(){
        var panel = util.createElement('div');
        util.addClass(panel,'h-panel');
        return panel;
    }
    protected onceExecute(fn:Function){
        var executed = false;
        var _fn = () => {
            if(executed){
                return;
            }
            executed = true;
            fn();
        };
        return _fn;
    }
    protected parseNode(text){
        if(typeof text === 'object' && this.isDomNode(text)){
            return [text];
        }else if(typeof text === 'string'){
            let div = util.createElement('div');
            div.innerHTML = text;
            return Array.prototype.slice.call(div.childNodes);
        }
        throw new Error('invalid data !');
    }
    protected isDomNode(object){
        if(typeof object !== 'object'){
            return false;
        }
        return typeof object.nodeType !== void 0;
    }
    abstract render();
    abstract remove();
}

export { Panel };