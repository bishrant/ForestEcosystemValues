import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import GeoJSONLayer from 'arcgis-js-api/layers/GeoJSONLayer';
import { MapcontrolService } from './mapcontrol.service';
import { redPolygon } from '../esrimap/renderers';
import Query from 'arcgis-js-api/tasks/support/Query';

@Injectable({
  providedIn: 'root'
})
export class GeojsonDataService {
  countyGeojsonLayer: any;
  urbanGeojsonLayer: any;
  constructor(private globals: GlobalsService, private mapControl: MapcontrolService) {
    const countyURL = this.globals.arcgisUrl + '/services/ForestEcosystemValues/ForestValues/MapServer/2/query?where=1%3D1&outFields=&returnGeometry=true&geometryPrecision=6&f=geojson';
    const urbanURL = this.globals.arcgisUrl + '/services/ForestEcosystemValues/ForestValues/MapServer/3/query?where=1%3D1&outFields=&returnGeometry=true&geometryPrecision=6&f=geojson';
    this.countyGeojsonLayer = new GeoJSONLayer({ url: countyURL, renderer: redPolygon, visible: true, definitionExpression: '1=0' });
    this.urbanGeojsonLayer = new GeoJSONLayer({ url: urbanURL, renderer: redPolygon, visible: true, definitionExpression: '1=0' });

    this.mapControl.clearGraphics$.subscribe((x) => {
      this.urbanGeojsonLayer.definitionExpression = '1=0';
      this.countyGeojsonLayer.definitionExpression = '1=0';
    })
  }

  filterGeojson = (layerName: string, value: any) => {
    return new Promise((resolve: any, reject: any) => {
      if (value === null) { resolve(null) }
      const query = new Query();
      const field = (layerName === 'County') ? 'NAME' : 'UrbanName';
      const layer = (layerName === 'County') ? this.countyGeojsonLayer : this.urbanGeojsonLayer;
      query.where = field + '=\'' + value + '\'';
      query.outFields = '*';
      query.returnGeometry = true;
      layer.queryFeatures(query).then((res: any) => {
        if (res.features.length > 0) {
          resolve(res.features);
        } else {
          reject(new Error('No features'));
        }
      }, (err) => reject(err));
    })
  }
}
