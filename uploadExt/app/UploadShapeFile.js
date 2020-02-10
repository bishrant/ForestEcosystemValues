/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UploadShapeFile = /** @class */ (function (_super) {
        __extends(UploadShapeFile, _super);
        function UploadShapeFile(params) {
            var _this = _super.call(this) || this;
            _this.file = '';
            return _this;
        }
        Object.defineProperty(UploadShapeFile.prototype, "files", {
            get: function () {
                return this.file;
            },
            enumerable: true,
            configurable: true
        });
        UploadShapeFile.prototype.fileUpload = function (e) {
            console.log(e.target.files);
            this.file = e.target.files;
        };
        UploadShapeFile.prototype.render = function () {
            return (widget_1.tsx("div", null,
                widget_1.tsx("input", { id: "image-file", type: "file", onchange: this.fileUpload }),
                widget_1.tsx("input", { type: "button", onclick: this.files, value: 'Get value' })));
        };
        UploadShapeFile = __decorate([
            decorators_1.subclass("esri.widgets.upload")
        ], UploadShapeFile);
        return UploadShapeFile;
    }(decorators_1.declared(Widget)));
    exports.UploadShapeFile = UploadShapeFile;
    var UploadShapeFileEmitFn = function (Base) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return class_1;
        }(Base));
    };
    var NewShapefile = UploadShapeFileEmitFn(UploadShapeFile);
    exports.NewShapefile = NewShapefile;
});
//# sourceMappingURL=UploadShapeFile.js.map