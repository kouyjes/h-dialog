export interface DialogOption{
    el:HTMLElement;
}
export interface InfoDialogOption extends DialogOption{
    type?:InfoDialogType;
    content:String;
    autoRemove:boolean;
    autoRemoveTime:number;
    width:String;
    maxHeight:String;
}
export enum InfoDialogType{
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}