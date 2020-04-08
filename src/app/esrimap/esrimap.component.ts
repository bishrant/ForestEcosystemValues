import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as promiseUtils from 'arcgis-js-api/core/promiseUtils';
import createMapView from './mapView';
import { SetupSketchViewModel, SelectMultipleCounties, SelectByPolygon } from './SelectCounties';
import SketchViewModel from 'arcgis-js-api/widgets/Sketch/SketchViewModel';
import { createGraphicsLayer, MultiPointLayer, createGraphicsFromShp } from './GraphicsLayer';
import { MapcontrolService } from '../services/mapcontrol.service';
import PrintTask from 'arcgis-js-api/tasks/PrintTask';
import PrintParameters from 'arcgis-js-api/tasks/support/PrintParameters';
import { Select } from '@ngxs/store';
import { SidebarControlsState } from '../shared/sidebarControls.state';
import MapImageLayer from 'arcgis-js-api/layers/MapImageLayer';
import { GeojsonDataService } from '../services/geojson-data.service';
import { fullExtent } from './Variables';
import { redPolygon } from './renderers';
import PrintTemplate from 'arcgis-js-api/tasks/support/PrintTemplate';
import { GlobalsService } from '../services/globals.service';

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
  printTemplate = new PrintTemplate({
    format: 'PDF',
    exportOptions: { dpi: 300 },
    layout: 'ForestValues_Print'
  });
  printParams = new PrintParameters();
  printMapTask = new PrintTask({ url: this.globals.arcgisUrl+'services/ForestEcosystemValues/ExportWebMap/GPServer/Export%20Web%20Map' });
  sketchVM = new SketchViewModel();

  constructor(private mapControl: MapcontrolService, private geojsonData: GeojsonDataService, private globals: GlobalsService) { }
  async initializeMap() {
    try {
      this.view = createMapView(this.mapViewEl);
      this.mapLoaded = true;
      let graphicsLayer = createGraphicsLayer();
      graphicsLayer.graphics.on('change', (evt) => {
        if (this.sketchVM.state !== 'active') {
          this.mapControl.graphicsLayerUpdated(graphicsLayer);
        }
      })
      const multiPointLayer = MultiPointLayer();
      const baseLayer = new MapImageLayer({
        url: this.globals.arcgisUrl + 'services/ForestEcosystemValues/ForestValues/MapServer',
        sublayers: [
          { id: 2, visible: true, opacity: 0.5 },
          { id: 11, visible: true, opacity: 1 }
        ]
      });
      this.view.map.addMany([baseLayer, graphicsLayer, multiPointLayer]);
      this.sketchVM = SetupSketchViewModel(multiPointLayer, this.view);
      this.view.when(() => {
        this.view.map.addMany([this.geojsonData.countyGeojsonLayer, this.geojsonData.urbanGeojsonLayer]);
      })

      const selectGeometry = promiseUtils.debounce((event) => {
        if (event.tool === 'multipoint') {
          this.busy = true;
          SelectMultipleCounties(event, this.geojsonData.countyGeojsonLayer, graphicsLayer).then(() => {
            this.busy = false;
          })
        }
        if (event.tool === 'polygon' && event.state === 'complete') {
          this.busy = true;
          // SelectByPolygon(event, this.geojsonData.countyGeojsonLayer, graphicsLayer).then(() => {
          //   this.busy = false;
          // })
          graphicsLayer.removeAll();
          const _features = this.sketchVM.layer.graphics.map(graphic => {
            graphic.symbol = redPolygon.symbol;
            return graphic;
          })
          graphicsLayer.addMany(_features);
          console.log(event, this.sketchVM);
          this.busy = false;
        }
        if (event.state === 'complete') {
          this.mapControl.graphicsLayerUpdated(graphicsLayer);
          this.mapControl.drawingCompleted(event.tool, event.state === 'complete');
        }
      });

      this.sketchVM.on(['create', 'update', 'complete', 'cancel'], selectGeometry);

      this.mapControl.startSpatialSelection$.subscribe((evt: any) => {
        if (evt !== null) {
          if (evt.action === 'clear') {
            this.sketchVM.cancel();
            graphicsLayer.removeAll();
            multiPointLayer.removeAll();
          } else {
            if (this.sketchVM.state !== 'active') {
              this.sketchVM.create(evt.current);
            }
          }
        }
      })

      this.mapControl.shapefileUploaded$.subscribe(shpFeatures => {
        const _shps = createGraphicsFromShp(shpFeatures);
        graphicsLayer.removeAll();
        graphicsLayer.addMany(_shps);
      })

      this.mapControl.activeLayers$.subscribe((lr) => {
        const subLrs = [];
        if (lr !== null) {
          for (let m in lr) {
            let master = lr[m];
            master.subLayers.forEach(sub => {
              subLrs.push({
                id: sub.id,
                visible: sub.visible && master.visible,
                opacity: (100 - master.opacity) / 100,
              });
            })
          }
        }
        baseLayer.sublayers = subLrs.reverse();
      })

      this.mapControl.clearGraphics$.subscribe((a) => graphicsLayer.removeAll())

      this.mapControl.mapExtent$.subscribe(extent => {
        this.view.extent = extent !== null ? extent.expand(2.5) : fullExtent;
      });

      this.mapControl.filterByCategory$.subscribe(async (req: any) => {
        this.geojsonData.filterGeojson(req.category, req.value).then(v => {
          graphicsLayer.removeAll();
          if (v !== null) {
            v[0].symbol = redPolygon.symbol;
            graphicsLayer.addMany(v);
            this.view.extent = v[0].geometry.extent.expand(1.5);
          }
        }).catch(e => console.error('promise error ', e))
      })

      const restoreBaseMap = (basemap: any) => {
        this.geojsonData.countyGeojsonLayer.visible = true;
        this.geojsonData.urbanGeojsonLayer.visible = true;
        this.view.map.basemap = basemap;
        this.mapControl.setAppBusyIndicator(false);
      }
      this.mapControl.printMap$.subscribe((info: any) => {
        if (info.status === 'active') {
          this.mapControl.setAppBusyIndicator(true);
          this.geojsonData.countyGeojsonLayer.visible = false;
          this.geojsonData.urbanGeojsonLayer.visible = false;
          const _basemap = this.view.map.basemap;
          this.view.map.basemap = {};
          this.printParams = new PrintParameters({ view: this.view, template: this.printTemplate });
          this.printMapTask.execute(this.printParams)
          .then((success: any) => {
            this.mapControl.setPrintMapStatus('done', success.url);
            restoreBaseMap(_basemap);
          })
          .catch((err: any) => {
            this.mapControl.setPrintMapStatus('error', '');
            restoreBaseMap(_basemap);
          });
        }
      });

      this.mapControl.closeSummaryTable$.subscribe(() => multiPointLayer.graphics.removeAll());
      return this.view;
    } catch (error) {
      console.log('Esri: ', error);
    }
  }

  ngOnInit() {
    this.initializeMap();
  }
}
