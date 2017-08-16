export interface PanelOption{
    el:HTMLElement;
}
export interface InfoPanelOption extends PanelOption{
    autoRemove:boolean;
    autoRemoveTime:number;
    width:String;
    maxHeight:String;
    contentElements?:any[];
}
export interface InfoDialogOption extends InfoPanelOption{
    type?:InfoDialogType;
    content:String;
    html?:any;
}
export enum InfoDialogType{
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}