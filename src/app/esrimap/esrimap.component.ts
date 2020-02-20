import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as promiseUtils from 'arcgis-js-api/core/promiseUtils';
import createMapView from './mapView';
import { setupSketchViewModel, SelectMultipleCounties, SelectByPolygon } from './SelectCounties';
import { createGraphicsLayer, MultiPointLayer } from './GraphicsLayer';
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
import { GeojsonDataService } from '../services/geojson-data.service';

@Component({
  selector: 'app-esrimap',
  templateUrl: './esrimap.component.html',
  styleUrls: ['./esrimap.component.scss']
})
export class EsrimapComponent implements OnInit {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  @Select(SidebarControlsState.getActiveLayers) activeLayers$;
  @Select(SidebarControlsState.getControl) activeControl$;
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


  constructor(private mapControl: MapcontrolService, private store: Store, private geojsonData: GeojsonDataService) { }

  async initializeMap() {
    try {
      this.view = createMapView(this.mapViewEl);
      this.mapLoaded = true;
      const graphicsLayer = createGraphicsLayer();
      const multiPointLayer = MultiPointLayer();
      const baseLayer = new MapImageLayer({
        url: this.arcgisServer + 'services/ForestEcosystemValues/ForestValues/MapServer',
        sublayers: [
          {id: 2, visible: true, opacity: 0.5},
          {id: 11, visible: true, opacity: 1}
        ]
      });
      this.view.map.addMany([baseLayer, graphicsLayer, multiPointLayer]);
      const sketchVM = setupSketchViewModel(multiPointLayer, this.view);
      this.view.when(() => {
        // lazyly add counties layer
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
          SelectByPolygon(event, this.geojsonData.countyGeojsonLayer, graphicsLayer).then(() => {
            this.busy = false;
          })
        }
      });

      sketchVM.on(['create', 'update', 'complete'], selectGeometry);

    this.activeControl$.subscribe((control: any) => {
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

      this.mapControl.activeLayers$.subscribe((lr) => {
        const subLrs = [];
        if (lr !== null) {
          lr.forEach(master => {
            master.subLayers.forEach(sub => {
              const _opacity = master.name === 'Boundaries' ? 0.5 : 1
              subLrs.push({ id: sub.id, visible: sub.defaultVisibility, opacity: _opacity })
            });
          });
        }
        baseLayer.sublayers = subLrs.reverse();
      })

      this.mapControl.mapExtent$.subscribe(extent => {
        this.view.extent = extent !== null ? extent.expand(2.5) : this.geojsonData.countyGeojsonLayer.fullExtent.expand(1.5);
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