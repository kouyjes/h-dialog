import { DialogOption } from './interface';
import { util } from './util';
abstract class Dialog implements DialogOption{
    el:HTMLElement;
    constructor(option:DialogOption){
    }
    protected elementSize(el:HTMLElement){
        var size = {
            width:el.offsetWidth,
            height:el.offsetHeight
        };
        return size;
    }
    protected assignOption(option:any,keys:String[] = []){
        keys.forEach((key) => {
            if(typeof this[key] === typeof option[key]){
                this[key] = option[key];
            }
        });
    }
    protected createPanel(){
        var panel = util.createElement('div');
        util.addClass(panel,'h-dialog');
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
    abstract render();
    abstract remove();
}

export { Dialog };