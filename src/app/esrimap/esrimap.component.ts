import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as promiseUtils from 'arcgis-js-api/core/promiseUtils';
import createMapView from './mapView';
import { setupSketchViewModel, SelectMultipleCounties, SelectByPolygon, fff } from './SelectCounties';
import { createGraphicsLayer, MultiPointLayer } from './GraphicsLayer';
import FeatureLayer from 'arcgis-js-api/layers/FeatureLayer';
// import { PointincountyService } from '../services/pointincounty.service';
import geojson from './data';
import { MapcontrolService } from '../services/mapcontrol.service';
import { Polygon } from 'arcgis-js-api/geometry';
import Graphic from 'arcgis-js-api/Graphic';
import GraphicsLayer from 'arcgis-js-api/layers/GraphicsLayer';
import { polygonSymbol } from './MapStyles';

@Component({
  selector: 'app-esrimap',
  templateUrl: './esrimap.component.html',
  styleUrls: ['./esrimap.component.scss']
})
export class EsrimapComponent implements OnInit {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  view: any;
  mapLoaded = false;
  busy = false;
  constructor(private mapControl: MapcontrolService) { }

  async initializeMap() {
    try {
      this.view = createMapView(this.mapViewEl);
      this.mapLoaded = true;
      const graphicsLayer = createGraphicsLayer();
      const multiPointLayer = MultiPointLayer();
      this.view.map.addMany([graphicsLayer, multiPointLayer]);
      const sketchVM = setupSketchViewModel(multiPointLayer, this.view);
      this.view.when(() => {
        // sketchVM.create('multipoint');
      })
      this.view.map.addMany([geojson]);
      const selectGeometry = promiseUtils.debounce((event) => {

        if (event.tool === 'multipoint') {
          this.busy = true;
          SelectMultipleCounties(event, geojson, graphicsLayer).then(() => {
            this.busy = false;
          })
        }
        if (event.tool === 'polygon' && event.state === 'complete') {
          this.busy = true;
          SelectByPolygon(event, geojson, graphicsLayer).then(() => {
            this.busy = false;
          })
        }
      });

      sketchVM.on(['create', 'update', 'complete'], selectGeometry);
      this.mapControl.controlActivated$.subscribe(control => {
        if (control === 'multipoint' || control === 'polygon') {
          sketchVM.create(control);
        }
      })

      this.mapControl.shapefileUploaded$.subscribe(shpFeatures => {
        const _shps = [];
        shpFeatures.forEach((shp) => {
          const polgn = new Polygon({
            rings: shp.geometry.rings,
            spatialReference: shp.geometry.spatialReference.wkid
          })
          const gg = new Graphic({
            geometry: polgn,
            symbol: polygonSymbol,
            attributes: shp.attributes
          })
          _shps.push(gg);
        })
        graphicsLayer.addMany(_shps);
      })

      return this.view;
    } catch (error) {
      console.log('Esri: ', error);
    }
  }

  ngOnInit() {
    this.initializeMap();
  }

}