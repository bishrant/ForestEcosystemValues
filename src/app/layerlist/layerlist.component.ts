import { Component, OnInit } from "@angular/core";
import { MapcontrolService } from "../services/mapcontrol.service";
import { layerInfo } from "./layerList.source";

@Component({
  selector: "app-layerlist",
  templateUrl: "./layerlist.component.html",
  styleUrls: ["./layerlist.component.scss"],
})
export class LayerlistComponent implements OnInit {
  objectKeys = Object.keys;
  layerInfo = layerInfo;
  changeOpacity = (layerName, event) => {
    this.layerInfo[layerName]["opacity"] = event.value;
    this.mapControl.changeActiveLayers(this.layerInfo);
  };

  // Click event on parent checkbox
  parentCheck(layerName: any, event: any) {
    this.layerInfo[layerName]["visible"] = event;
    this.mapControl.changeActiveLayers(this.layerInfo);
  }

  changeRadioLayers(key, id) {
    this.layerInfo[key].visibleSubLayer = id;
    this.layerInfo[key].subLayers = this.layerInfo[key].subLayers.map((s) => {
      s.visible = s.id === id ? true : false;
      return s;
    });
    this.mapControl.changeActiveLayers(this.layerInfo);
  }

  // Click event on child checkbox
  childCheck(layerName, subLayer) {
    this.layerInfo[layerName]["subLayers"] = subLayer;
    this.mapControl.changeActiveLayers(this.layerInfo);
  }

  constructor(private mapControl: MapcontrolService) {}

  ngOnInit() {
    this.mapControl.changeActiveLayers(this.layerInfo);
  }
}
