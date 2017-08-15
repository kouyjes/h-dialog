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

var nextFrame = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFram'] || function (executor) {
    return setTimeout(executor, 1000 / 60);
};
var cancelFrame = window.cancelAnimationFrame || window['webkitCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || clearTimeout;
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
    function removeElement(target) {
        if (isFunction(target.remove)) {
            return target.remove();
        }
        var p = parent(target);
        if (p) {
            p.removeChild(target);
        }
    }
    util.removeElement = removeElement;
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
    
    var timeoutCache = {};
    function delayExecute(identifyName, fn) {
        if (timeoutCache[identifyName]) {
            cancelFrame(timeoutCache[identifyName]);
        }
        var timeout = nextFrame(fn);
        timeoutCache[identifyName] = timeout;
    }
    util.delayExecute = delayExecute;
})(util || (util = {}));

var Dialog = (function () {
    function Dialog(option) {
    }
    Dialog.prototype.elementSize = function (el) {
        var size = {
            width: el.offsetWidth,
            height: el.offsetHeight
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

var InfoDialogType;
(function (InfoDialogType) {
    InfoDialogType[InfoDialogType["INFO"] = 'info'] = "INFO";
    InfoDialogType[InfoDialogType["WARN"] = 'warn'] = "WARN";
    InfoDialogType[InfoDialogType["ERROR"] = 'error'] = "ERROR";
})(InfoDialogType || (InfoDialogType = {}));

var prefixes = ["webkit", "moz", "MS", "o"];
var infoDialogClass = {
    'info': 'h-info',
    'warn': 'h-warn',
    'error': 'h-error'
};
var InfoDialog = (function (_super) {
    __extends(InfoDialog, _super);
    function InfoDialog(option) {
        _super.call(this, option);
        this.type = InfoDialogType.INFO;
        this.content = '';
        this.autoRemove = true;
        this.autoRemoveTime = 2000;
        this.width = '';
        this.maxHeight = '';
        this._bottom = 0;
        this.assignOption(option, ['type', 'width', 'maxHeight', 'content', 'autoRemove', 'autoRemoveTime']);
    }
    InfoDialog.show = function (option, type) {
        if (type === void 0) { type = InfoDialogType.INFO; }
        option.type = type;
        var dialog = new InfoDialog(option);
        dialog.render();
        return dialog;
    };
    InfoDialog.info = function (option) {
        return InfoDialog.show(option);
    };
    InfoDialog.warn = function (option) {
        return InfoDialog.show(option, InfoDialogType.WARN);
    };
    InfoDialog.error = function (option) {
        return InfoDialog.show(option, InfoDialogType.ERROR);
    };
    InfoDialog.triggerRemoveEvent = function () {
        util.delayExecute('triggerRemoveInfoDialogEvent', function () {
            var bottom = InfoDialog.startBottom, size;
            InfoDialog.instances.forEach(function (instance) {
                instance.updateBottom(bottom);
                size = instance.elementSize(instance.el);
                bottom += size.height + InfoDialog.margin;
            });
        });
    };
    InfoDialog.prototype.render = function () {
        if (InfoDialog.instances.indexOf(this) >= 0) {
            return;
        }
        var panel = this.createPanel();
        util.addClass(panel, 'h-dialog-info');
        util.addClass(panel, 'h-visible');
        util.addClass(panel, infoDialogClass[this.type]);
        if (this.width) {
            panel.style.width = this.width;
        }
        var iconPanel = util.createElement('div');
        util.addClass(iconPanel, 'h-dialog-icon');
        var image = util.createElement('div');
        util.addClass(image, 'h-dialog-image');
        iconPanel.appendChild(image);
        var closeIcon = util.createElement('div');
        util.addClass(closeIcon, 'h-dialog-close');
        iconPanel.appendChild(closeIcon);
        this.bindCloseEvent(closeIcon);
        var contentPanel = util.createElement('div');
        util.addClass(contentPanel, 'h-dialog-content');
        var textNode = document.createTextNode(this.content);
        contentPanel.appendChild(textNode);
        if (this.maxHeight) {
            contentPanel.style.maxHeight = this.maxHeight;
        }
        panel.appendChild(iconPanel);
        panel.appendChild(contentPanel);
        this.el = panel;
        if (this.autoRemove) {
            this.triggerAutoRemove();
        }
        InfoDialog.instances.push(this);
        this.updatePosition();
        document.body.appendChild(panel);
    };
    InfoDialog.prototype.bindCloseEvent = function (colseEl) {
        var _this = this;
        colseEl.addEventListener('click', function () {
            _this.remove();
        });
    };
    InfoDialog.prototype.updatePosition = function () {
        var _this = this;
        var instances = InfoDialog.instances;
        var index = instances.length - 1;
        var bottom = InfoDialog.startBottom, size;
        for (var i = 0; i < index; i++) {
            size = this.elementSize(instances[i].el);
            bottom += size.height + InfoDialog.margin;
        }
        this.updateBottom(bottom);
        util.delayExecute('checkInfoDialogOverflow', function () {
            _this.checkOverflow();
        });
    };
    InfoDialog.prototype.checkOverflow = function () {
        if (InfoDialog.instances.length === 0) {
            return;
        }
        var instances = InfoDialog.instances;
        var clientHeight = window.innerHeight, size = this.elementSize(this.el);
        var i, _height = 0;
        var removedInstances = [];
        if (this._bottom + size.height + InfoDialog.margin >= clientHeight) {
            for (i = 0; i < instances.length; i++) {
                _height += this.elementSize(instances[i].el).height;
                removedInstances.push(instances[i]);
                if (_height >= size.height) {
                    break;
                }
            }
            instances.splice(0, i + 1);
            InfoDialog.overflowRemove(removedInstances);
        }
    };
    InfoDialog.prototype.updateBottom = function (bottom) {
        if (bottom === void 0) { bottom = 0; }
        this.el.style.bottom = bottom + 'px';
        this._bottom = bottom;
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
    InfoDialog.overflowRemove = function (instances) {
        InfoDialog.instances = InfoDialog.instances.filter(function (_instance) {
            return instances.indexOf(_instance) === -1;
        });
        instances.forEach(function (instance) {
            util.removeClass(instance.el, 'h-visible');
            setTimeout(function () {
                util.removeElement(instance.el);
            }, 800);
        });
        InfoDialog.triggerRemoveEvent();
    };
    InfoDialog.prototype.remove = function () {
        var index = InfoDialog.instances.indexOf(this);
        if (index >= 0) {
            InfoDialog.instances.splice(index, 1);
        }
        util.removeElement(this.el);
        InfoDialog.triggerRemoveEvent();
    };
    InfoDialog.startBottom = 5;
    InfoDialog.instances = [];
    InfoDialog.margin = 10;
    return InfoDialog;
}(Dialog));

exports.InfoDialog = InfoDialog;

Object.defineProperty(exports, '__esModule', { value: true });

})));
