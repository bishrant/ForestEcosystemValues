import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as t from 'arcgis-js-api/core/promiseUtils';
import createMapView from './mapView';
import { setupSketchViewModel, selectCounties } from './SelectCounties';
import { createGraphicsLayer, MultiPointLayer } from './GraphicsLayer';
import { PointincountyService } from '../services/pointincounty.service';
import FeatureLayer from 'arcgis-js-api/layers/FeatureLayer';
import geojson from './data';
import Point from 'arcgis-js-api/geometry/Point';
import SketchViewModel from 'arcgis-js-api/widgets/Sketch';

@Component({
  selector: 'app-esrimap',
  templateUrl: './esrimap.component.html',
  styleUrls: ['./esrimap.component.scss']
})
export class EsrimapComponent implements OnInit {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  view: any;
  mapLoaded = false;
  constructor(private pointInCountyService: PointincountyService) { }

  async initializeMap() {
    try {
      console.log(t);
      this.view = createMapView(this.mapViewEl);
      this.mapLoaded = true;
      let graphicsLayer = createGraphicsLayer();
      let multiPointLayer = MultiPointLayer();
      // const states = new FeatureLayer({ url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_States_Generalized/FeatureServer/0' })
      this.view.map.addMany([graphicsLayer, multiPointLayer]);
      // this.view.map.add(states);
      // const sketchVM = setupSketchViewModel(multiPointLayer, this.view);
      

      const sketchVM = new SketchViewModel({
        view: this.view,
        layer: graphicsLayer,
        pointSymbol: {
            type: 'simple-marker',
            style: 'circle',
            color: '#8A2BE2',
            size: '0px'
        },
        updateOnGraphicClick: false
    });
      
      this.view.when(() => {

        sketchVM.create('multipoint');
        sketchVM.on(['create', 'update', 'complete'], selectGeometry);
      })

      // const sketchViewUpdate = (event: any) => {
      //   // console.log(graphicsLayer.graphics.length, sketchVM.layer.graphics.length)
      //   if (event.tool === 'multipoint') {
      //     // console.log(event.graphic);
      //      const t = event.graphic;
      //      t.symbol = multiPointLayer.symbol;
      //      multiPointLayer.graphics.add(t);
      //     // window.requestAnimationFrame(() => console.log(1))
      //     // handleCountySelection(event);
      //     selectGeometry(event.graphic.geometry);
      //   }
      // }

      this.view.map.add(geojson);

      const selectGeometry = t.debounce((event) => {
        console.log(sketchVM);
        console.log(event.graphic);
        const total = event.graphic.geometry.points.length;
        const lastGeom = event.graphic.geometry.points[total - 1];
        const newPt = new Point({ x: lastGeom[0], y: lastGeom[1], spatialReference: { wkid: 3857 } });
        const g = event.graphic.geometry;
        if (event.tool !== 'multipoint') return;
        return geojson.queryFeatures({
          geometry: newPt,
          spatialRelationship: 'intersects',
          returnGeometry: true,
          maxRecordCount: 0,
          outFields: ['NAME']
        }).then((results) => {
          let existingCounties = [];
          if (graphicsLayer.graphics.length > 0) existingCounties = graphicsLayer.graphics.map((f) => { return f.attributes.NAME }).items;
          console.log(existingCounties);
          const features = results.features.map((graphic) => {
            graphic.symbol = {
              type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
              color: 'transparent',
              style: 'solid',
              outline: {  // autocasts as new SimpleLineSymbol()
                color: 'red',
                width: 3
              }
            };
            return graphic;
            // console.log(graphic.attributes.NAME);
            // if (existingCounties.length < 1) return graphic;
            // if (existingCounties.indexOf(graphic.attributes.NAME) === -1) { return graphic; }
            // else { return null };
          });


          const exts = graphicsLayer.graphics;
          const featureFilter = features[0]; //.filter((ff) => { return ff !== null });
          if (existingCounties.indexOf(featureFilter.attributes.NAME) === -1) {
            graphicsLayer.add(featureFilter);
          } else {
            console.log("need to remove");
            const _g = graphicsLayer.graphics.filter((g) => {return g.attributes.NAME === featureFilter.attributes.NAME})
            graphicsLayer.remove(_g);
          }
          

          // exts.forEach((g) => {
          //   if (g.attributes.NAME === featureFilter.attributes.NAME) {
          //     exts.pop(g);
          //   }
          // })


          
          // console.log(featureFilter, features)
          // graphicsLayer.removeAll();
          // graphicsLayer.addMany(featureFilter);
          // console.log(features);

        });
      });



      return this.view;
    } catch (error) {
      console.log('Esri: ', error);
    }
  }

  ngOnInit() {
    this.initializeMap();
  }

}