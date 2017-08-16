## Get Started
### Demo

[Demo url](https://kouyjes.github.io/h-dialog/example/index.html)

### Interface
```javascript
   interface PanelOption{
       el:HTMLElement;
       contentElements?:any[];
   }
   enum Align{
       LEFT = 'left',
       RIGHT = 'right',
       CENTER = 'center'
   }
   interface InfoPanelOption extends PanelOption{
       autoRemove:boolean;
       autoRemoveTime:number;
       css:Object;
       align:Align;
   }
   interface InfoDialogOption extends InfoPanelOption{
       type?:InfoDialogType;
       content:String;
       maxHeight:String;
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
    var InfoWindow = HERE.UI.InfoWindow;
    var template = '<div>text</div>';
    InfoWindow.show({
         autoRemove:true,
         autoRemoveTime:5000,
         css:{
            backgroundColor:'#ccc'
         },
         contentElements:[template]
     });
```
### InfoDialog Example
```javascript
    var Dialog = HERE.UI.InfoDialog;
    Dialog.info({
        maxHeight:'200px', // String optional
        content:'content text',
        html:'',// string or dom
        autoRemove:true, // boolean optional
        autoRemoveTime:timeout // timeout in ms ,optional
    });
```