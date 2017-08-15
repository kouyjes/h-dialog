## Get Started
### Demo
[Demo url](https://kouyjes.github.io/h-dialog/example/index.html)
### Interface
```javascript
    export interface DialogOption{
        el:HTMLElement;
    }
    interface InfoDialogOption extends DialogOption{
        type?:InfoDialogType;
        content:String;
        autoRemove:boolean;
        autoRemoveTime:number;
        width:String;
        maxHeight:String;
    }
    enum InfoDialogType{
        INFO = 'info',
        WARN = 'warn',
        ERROR = 'error'
    }
```
### Example
```javascript
    var Dialog = HERE.UI.InfoDialog;
    Dialog.info({
        width:'',// String optional
        maxHeight:'200px', // String optional
        content:'content text',
        autoRemove:true, // boolean optional
        autoRemoveTime:timeout // timeout in ms ,optional
    });
```