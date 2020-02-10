/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {subclass, declared, property} from "esri/core/accessorSupport/decorators";

import Widget = require("esri/widgets/Widget");

import { renderable, tsx } from "esri/widgets/support/widget";


import Accessor = require("esri/core/Accessor");

type Constructor<T = {}> = new (...args: any[]) => T;

@subclass("esri.widgets.upload")
class UploadShapeFile extends declared(Widget) {
  constructor(params?: any) {
    super();
  }

  file: any = '';

  get files(): any {
    return this.file;
  }

  private fileUpload(e: any) : any {
    console.log(e.target.files);
    this.file = e.target.files;
  }

  render() {
    return (
      <div >
        <input id="image-file" type="file" onchange={this.fileUpload} />
        <input type="button" onclick={this.files} value='Get value' />
      </div>
      );
  }
}

const UploadShapeFileEmitFn = <TBase extends Constructor>(Base: TBase) => {

  return class extends Base {
    // file = "some test";
  }
}

const NewShapefile = UploadShapeFileEmitFn(UploadShapeFile);

export {UploadShapeFile, NewShapefile};