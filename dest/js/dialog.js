/* dialog */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.HERE = global.HERE || {}, global.HERE.UI = global.HERE.UI || {})));
}(this, (function (exports) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var util;
(function (util) {
    util.namespaces = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/'
    };
    function isDefined(value) {
        return value !== undefined;
    }
    util.isDefined = isDefined;
    function isNumber(value) {
        return typeof value === 'number';
    }
    util.isNumber = isNumber;
    function valueOf(value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = value; }
        return isDefined(value) ? value : defaultValue;
    }
    util.valueOf = valueOf;
    function isFunction(fn) {
        return typeof fn === 'function';
    }
    util.isFunction = isFunction;
    function createSvgElement(qualifiedName) {
        var namespaceURI = util.namespaces.svg;
        return document.createElementNS(namespaceURI, qualifiedName);
    }
    util.createSvgElement = createSvgElement;
    function createElement(qualifiedName) {
        var el = document.createElement(qualifiedName);
        return el;
    }
    util.createElement = createElement;
    function preAppend(parent, element) {
        var children = parent.children;
        if (children && children.length > 0) {
            parent.insertBefore(element, children[0]);
        }
        else if (parent.firstChild) {
            parent.insertBefore(element, parent.firstChild);
        }
        else {
            parent.appendChild(element);
        }
    }
    util.preAppend = preAppend;
    function toggleVisible(el, visible) {
        var className = 'active';
        toggleClass(el, className, visible);
    }
    util.toggleVisible = toggleVisible;
    function toggleSelect(el, select) {
        var className = 'selected';
        toggleClass(el, className, select);
    }
    util.toggleSelect = toggleSelect;
    function getClassNames(el) {
        var clazz = el.getAttribute('class') || '';
        var classNames = clazz.split(/\s+/);
        return classNames;
    }
    function addClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        if (classNames.indexOf(className) >= 0) {
            return;
        }
        classNames.push(className);
        el.setAttribute('class', classNames.join(' '));
    }
    util.addClass = addClass;
    function removeClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        var index = classNames.indexOf(className);
        if (index >= 0) {
            classNames.splice(index, 1);
        }
        el.setAttribute('class', classNames.join(' '));
    }
    util.removeClass = removeClass;
    function hasClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        return classNames.indexOf(className) >= 0;
    }
    util.hasClass = hasClass;
    function toggleClass(el, className, addOrRemove) {
        if (addOrRemove === void 0) {
            addOrRemove = !hasClass(el, className);
        }
        if (addOrRemove) {
            addClass(el, className);
        }
        else {
            removeClass(el, className);
        }
    }
    util.toggleClass = toggleClass;
    function style(el, name, value) {
        var style = el.style;
        if (isObject(name)) {
            Object.keys(name).forEach(function (key) {
                if (key in style) {
                    style[key] = name[key];
                }
            });
        }
        else if (isString(name)) {
            if (value === undefined) {
                return style[name];
            }
            style[name] = value;
        }
    }
    util.style = style;
    
    function parent(target) {
        return target.parentElement || target.parentNode;
    }
    util.parent = parent;
    function isObject(value) {
        return typeof value === 'object' && null != value;
    }
    util.isObject = isObject;
    function isString(value) {
        return typeof value === 'string';
    }
    util.isString = isString;
    function isEventSupport(eventType) {
        return 'on' + eventType in document;
    }
    util.isEventSupport = isEventSupport;
    
})(util || (util = {}));

var Dialog = (function () {
    function Dialog(option) {
        var parent = option.parent;
        if (typeof parent === 'string') {
            parent = document.querySelector(parent);
        }
        this.parent = parent;
    }
    Dialog.prototype.elementSize = function (el) {
        var size = {
            width: el.clientWidth,
            height: el.clientHeight
        };
        return size;
    };
    Dialog.prototype.assignOption = function (option, keys) {
        var _this = this;
        if (keys === void 0) { keys = []; }
        keys.forEach(function (key) {
            if (typeof _this[key] === typeof option[key]) {
                _this[key] = option[key];
            }
        });
    };
    Dialog.prototype.createPanel = function () {
        var panel = util.createElement('div');
        util.addClass(panel, 'h-dialog');
        return panel;
    };
    Dialog.prototype.onceExecute = function (fn) {
        var executed = false;
        var _fn = function () {
            if (executed) {
                return;
            }
            executed = true;
            fn();
        };
        return _fn;
    };
    return Dialog;
}());

var prefixes = ["webkit", "moz", "MS", "o"];
var InfoDialog = (function (_super) {
    __extends(InfoDialog, _super);
    function InfoDialog(option) {
        _super.call(this, option);
        this.content = '';
        this.autoRemove = true;
        this.autoRemoveTime = 2000;
        this.assignOption(option, ['content', 'autoRemove', 'autoRemoveTime']);
    }
    InfoDialog.show = function (option) {
        var dialog = new InfoDialog(option);
        dialog.render();
        return dialog;
    };
    InfoDialog.triggerRemoveEvent = function () {
        var bottom = 0, size;
        InfoDialog.instances.forEach(function (instance) {
            instance.updateBottom(bottom);
            size = instance.elementSize(instance.el);
            bottom += size.height + InfoDialog.margin;
        });
    };
    InfoDialog.prototype.render = function () {
        if (InfoDialog.instances.indexOf(this) >= 0) {
            return;
        }
        var panel = this.createPanel();
        util.addClass(panel, 'h-dialog-info');
        util.addClass(panel, 'h-visible');
        var iconPanel = util.createElement('div');
        util.addClass(iconPanel, 'h-dialog-icon');
        var image = util.createElement('div');
        iconPanel.appendChild(image);
        var contentPanel = util.createElement('div');
        util.addClass(contentPanel, 'h-dialog-content');
        var textNode = document.createTextNode(this.content);
        contentPanel.appendChild(textNode);
        panel.appendChild(iconPanel);
        panel.appendChild(contentPanel);
        this.parent.appendChild(panel);
        this.el = panel;
        if (this.autoRemove) {
            this.triggerAutoRemove();
        }
        InfoDialog.instances.push(this);
        this.updatePosition();
    };
    InfoDialog.prototype.updatePosition = function () {
        var index = InfoDialog.instances.length - 1;
        var bottom = 0, size;
        for (var i = 0; i < index; i++) {
            size = this.elementSize(this.el);
            bottom += size.height + InfoDialog.margin;
        }
        this.updateBottom(bottom);
    };
    InfoDialog.prototype.updateBottom = function (bottom) {
        if (bottom === void 0) { bottom = 0; }
        this.el.style.bottom = bottom + 'px';
    };
    InfoDialog.prototype.triggerAutoRemove = function () {
        var _this = this;
        var onceExecuteFn = this.onceExecute(function () {
            _this.remove();
        });
        setTimeout(function () {
            util.removeClass(_this.el, 'h-visible');
            setTimeout(onceExecuteFn, 1300);
            var eventType = 'AnimationEnd';
            prefixes.forEach(function (prefix) {
                _this.el.addEventListener(prefix + eventType, onceExecuteFn);
            });
        }, this.autoRemoveTime);
    };
    InfoDialog.prototype.remove = function () {
        var index = InfoDialog.instances.indexOf(this);
        if (index >= 0) {
            InfoDialog.instances.splice(index, 1);
        }
        this.el.remove();
        InfoDialog.triggerRemoveEvent();
    };
    InfoDialog.instances = [];
    InfoDialog.margin = 10;
    return InfoDialog;
}(Dialog));

exports.InfoDialog = InfoDialog;

Object.defineProperty(exports, '__esModule', { value: true });

})));
