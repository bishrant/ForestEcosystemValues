import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import GeoJSONLayer from 'arcgis-js-api/layers/GeoJSONLayer';
import { MapcontrolService } from './mapcontrol.service';
import { redPolygon } from '../esrimap/renderers';

@Injectable({
  providedIn: 'root'
})
export class GeojsonDataService {
  countyGeojsonLayer: any;
  urbanGeojsonLayer: any;
  constructor(private globals: GlobalsService, private mapControl: MapcontrolService) {
    const countyURL = this.globals.arcgisUrl+'/services/ForestEcosystemValues/ForestValues/MapServer/2/query?where=1%3D1&outFields=&returnGeometry=true&geometryPrecision=6&f=geojson';
    const urbanURL = this.globals.arcgisUrl+'/services/ForestEcosystemValues/ForestValues/MapServer/3/query?where=1%3D1&outFields=&returnGeometry=true&geometryPrecision=6&f=geojson';
    this.countyGeojsonLayer = new GeoJSONLayer({ url: countyURL, renderer: redPolygon, visible: true, definitionExpression: '1=0' });
    this.urbanGeojsonLayer = new GeoJSONLayer({ url: urbanURL, renderer: redPolygon, visible: true, definitionExpression: '1=0' });

    this.mapControl.filterByCountyName$.subscribe(county => {
      this.countyGeojsonLayer.definitionExpression = 'NAME=\''+ county+ '\'';
      this.countyGeojsonLayer.queryExtent().then(ext => {
        this.mapControl.setMapExtent(ext.extent)
      });
      // this.countyGeojsonLayer.queryFeatures().then(res => console.log('results of query ', res))
    })

    this.mapControl.filterByUrbanName$.subscribe(urban => {
      this.urbanGeojsonLayer.definitionExpression = 'UrbanName=\''+ urban+ '\'';
      this.urbanGeojsonLayer.queryExtent().then(ext => this.mapControl.setMapExtent(ext.extent));
    });

    this.mapControl.clearGraphics$.subscribe((x) => {
      this.urbanGeojsonLayer.definitionExpression = '1=0';
      this.countyGeojsonLayer.definitionExpression = '1=0';
    })
  }
}
