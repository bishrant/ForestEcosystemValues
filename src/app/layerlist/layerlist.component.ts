import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { MapcontrolService } from '../services/mapcontrol.service';

@Component({
  selector: 'app-layerlist',
  templateUrl: './layerlist.component.html',
  styleUrls: ['./layerlist.component.scss']
})
export class LayerlistComponent implements OnInit {
  dataTable: any;
  layers: any = [];
  getSubLayers = (master: any, layers: any) => {
    return layers.filter(l => l.parentLayerId === master.id);
  }

  // Click event on parent checkbox
  parentCheck(masterLayer: any) {
    masterLayer.subLayers.forEach((s: any) => {
      s.defaultVisibility = masterLayer.defaultVisibility;
    })
    this.mapControl.changeActiveLayers(this.dataTable);
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // Click event on child checkbox
  childCheck(masterLayer, subLayer) {
    masterLayer.defaultVisibility = subLayer.every((c: any) => {
      return c.defaultVisibility === true;
    })
    this.mapControl.changeActiveLayers(this.dataTable);
  }

  createLayerList = () => {
    this.http.get(this.globals.arcgisUrl + 'services/ForestEcosystemValues/ForestValues/MapServer?f=json').subscribe((datas: any) => {
      const headings = datas.layers.filter(l => l.subLayerIds !== null);
      const d = headings.map((h: any) => {
        h.subLayers = this.getSubLayers(h, datas.layers);
        h.visible = h.defaultVisibility;
        return h;
      })
      this.dataTable = d;
      this.mapControl.changeActiveLayers(this.dataTable);
    })
  }
  constructor(private http: HttpClient, private globals: GlobalsService, private mapControl: MapcontrolService) { }

  ngOnInit() {
    this.createLayerList();
  }

}
