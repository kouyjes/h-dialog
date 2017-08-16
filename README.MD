## Get Started
### Demo

[Demo url](https://kouyjes.github.io/h-dialog/example/index.html)

### Interface
```javascript
   interface PanelOption{
       el:HTMLElement;
   }
   interface InfoPanelOption extends PanelOption{
       autoRemove:boolean;
       autoRemoveTime:number;
       width:String;
       maxHeight:String;
       contentElements?:any[];
   }
   interface InfoDialogOption extends InfoPanelOption{
       type?:InfoDialogType;
       content:String;
       html?:any;
   }
   enum InfoDialogType{
       INFO = 'info',
       WARN = 'warn',
       ERROR = 'error'
   }
```
### InfoPanel Example
```javascript
    var InfoPanel = HERE.UI.InfoPanel;
    var template = '<div>text</div>';
    InfoPanel.show({
         autoRemove:true,
         autoRemoveTime:5000,
         contentElements:[template]
     });
```
### InfoDialog Example
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