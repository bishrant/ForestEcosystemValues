import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { MapcontrolService } from '../services/mapcontrol.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {
  allLayers: any[] = [];
  visibleLayers: any[] = [];
  activeMapLayers: any;
  constructor(private http: HttpClient, private globals: GlobalsService, private mapControl: MapcontrolService) { }

  updateLegend = () => {
    console.log(this.activeMapLayers);
    let _subLayers = [];
    for (let key in this.activeMapLayers) {
      const _master = this.activeMapLayers[key];
      const _subLrs = _master.subLayers.filter(l => l.visible && _master.visible);
      if (_subLrs.length > 0) _subLayers.push(_subLrs);
    }
    const activeSubLayers = _subLayers.flat().map((i) => i.id);
    this.visibleLayers = this.allLayers.filter(v => activeSubLayers.indexOf(v.layerId) !== -1);
  }

  ngOnInit() {
    this.http.get(this.globals.arcgisUrl + 'services/ForestEcosystemValues/ForestValues/MapServer/legend?dynamicLayers=%5B1%5D&f=pjson')
      .subscribe((l: any) => {
        this.allLayers = l.layers;
        this.updateLegend();
      })

    this.mapControl.activeLayers$.subscribe((actives: any) => {
      this.activeMapLayers = actives;
      this.updateLegend()
    })

  }
}
