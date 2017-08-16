export interface PanelOption{
    el:HTMLElement;
    contentElements?:any[];
}
export enum Align{
    LEFT = 'left',
    RIGHT = 'right',
    CENTER = 'center'
}
export interface InfoPanelOption extends PanelOption{
    autoRemove:boolean;
    autoRemoveTime:number;
    css:Object;
    align:Align;
}
export interface InfoDialogOption extends InfoPanelOption{
    type?:InfoDialogType;
    content:String;
    maxHeight:String;
    html?:any;
}
export enum InfoDialogType{
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}