export interface DialogOption{
    parent:HTMLElement;
}
export interface InfoDialogOption extends DialogOption{
    content:String;
    autoRemove:boolean;
    autoRemoveTime:number;
}