import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as promiseUtils from 'arcgis-js-api/core/promiseUtils';
import createMapView from './mapView';
import { setupSketchViewModel, SelectMultipleCounties, SelectByPolygon, fff } from './SelectCounties';
import { createGraphicsLayer, MultiPointLayer } from './GraphicsLayer';
import geojson from './data';
import { MapcontrolService } from '../services/mapcontrol.service';
import { Polygon } from 'arcgis-js-api/geometry';
import Graphic from 'arcgis-js-api/Graphic';
import { polygonSymbol } from './MapStyles';

import PrintTask from 'arcgis-js-api/tasks/PrintTask';
import PrintParameters from 'arcgis-js-api/tasks/support/PrintParameters';
import { createPNGForReport, getReportValues } from './ReportServices';
import { Store, Select } from '@ngxs/store';
import { SidebarControlsState } from '../shared/sidebarControls.state';
import { ChangeReportData } from '../shared/sidebarControls.actions';
import MapImageLayer from 'arcgis-js-api/layers/MapImageLayer';

@Component({
  selector: 'app-esrimap',
  templateUrl: './esrimap.component.html',
  styleUrls: ['./esrimap.component.scss']
})
export class EsrimapComponent implements OnInit {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  @Select(SidebarControlsState.getActiveLayers) activeLayers$;
  view: any;
  mapLoaded = false;
  busy = false;
  arcgisServer = 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/'
  printMapTask = new PrintTask({ url: this.arcgisServer + 'services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task' });
  printParams = new PrintParameters({ view: this.view })
  printMap = () => {
    console.log('print')
    this.printMapTask.execute(this.printParams).then((f) => console.log(f))
  }


  constructor(private mapControl: MapcontrolService, private store: Store) { }

  async initializeMap() {
    try {
      this.view = createMapView(this.mapViewEl);
      this.mapLoaded = true;
      const graphicsLayer = createGraphicsLayer();
      const multiPointLayer = MultiPointLayer();
      const baseLayer = new MapImageLayer({
        url: this.arcgisServer + 'services/ForestEcosystemValues/ForestValues/MapServer',

      });
      this.view.map.addMany([baseLayer, graphicsLayer, multiPointLayer]);
      const sketchVM = setupSketchViewModel(multiPointLayer, this.view);
      this.view.when(() => {
        // baseLayer.set
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

      const generateSummaryStatistics = () => {
        getReportValues(graphicsLayer).then((v) => {
          this.store.dispatch(new ChangeReportData(v));
        })
      }

      const createReport = () => {
        const pngPromise = createPNGForReport(graphicsLayer);
        const reportDataPromise = getReportValues(graphicsLayer);
        Promise.all([pngPromise, reportDataPromise]).then((values) => {
          console.log('promise values', values)
        })
      }

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
            attributes: shp.attributes,
            popupTemplate: {}
          });
          _shps.push(gg);
        })
        graphicsLayer.removeAll();
        graphicsLayer.addMany(_shps);
      })

      this.mapControl.generateSummary$.subscribe((d) => {
        generateSummaryStatistics();
      })

      this.activeLayers$.subscribe(lr => {
        const subLrs = [];
        // if (lr !== null) {
        //   lr.forEach(master => {
        //     master.subLayers.forEach(sub => {
        //       subLrs.push({ id: sub.id, visible: sub.defaultVisibility })
        //     });
        //   });
        // }
        console.log('Active Layers, ', lr)
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