import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as promiseUtils from 'arcgis-js-api/core/promiseUtils';
import createMapView from './mapView';
import { setupSketchViewModel, SelectMultipleCounties, SelectByPolygon, fff } from './SelectCounties';
import { createGraphicsLayer, MultiPointLayer } from './GraphicsLayer';
import geojson from './data';
import { MapcontrolService } from '../services/mapcontrol.service';
import { Polygon } from 'arcgis-js-api/geometry';
import Graphic from 'arcgis-js-api/Graphic';
import Geoprocessor from 'arcgis-js-api/tasks/Geoprocessor';
import { polygonSymbol } from './MapStyles';
import FeatureSet = require('arcgis-js-api/tasks/support/FeatureSet');
import PrintTask from 'arcgis-js-api/tasks/PrintTask';
import PrintParameters from 'arcgis-js-api/tasks/support/PrintParameters';

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
  arcgisServer = 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/'
  printMapTask = new PrintTask({ url: this.arcgisServer + 'services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task' });
  printParams = new PrintParameters({ view: this.view })
  printMap = () => {
    console.log('print')
    this.printMapTask.execute(this.printParams).then((f) => console.log(f))
  }
  constructor(private mapControl: MapcontrolService) { }

  async initializeMap() {
    try {
      this.view = createMapView(this.mapViewEl);
      this.mapLoaded = true;
      const graphicsLayer = createGraphicsLayer();
      const multiPointLayer = MultiPointLayer();
      const gp: any = Geoprocessor(this.arcgisServer + 'services/TxFIP/CalculateForestValues2020/GPServer/CalculateForestValues');
      const printGP: any = Geoprocessor(this.arcgisServer + 'services/ForestEcosystemValues/ExportReportImage/GPServer/ExportReportImage');
      gp.outSpatialReference = { wkid: 102100 };

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

      const createPNGForReport = async (featureSet) => {
        printGP.submitJob({ polygon: featureSet }).then((jobInfo) => {
          const jobid = jobInfo.jobId;
          const options = {
            interval: 1500,
            statusCallback: (j) => {
              console.log('Job Status: ', j.jobStatus);
            }
          };

          printGP.waitForJobCompletion(jobid, options).then(() => {
            printGP.getResultData(jobid, 'output').then((data) => {
              console.log(data, data.value);
              return data.value;
            })
          })
        });
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
            attributes: shp.attributes
          });


          _shps.push(gg);
        })
        const featureSet = new FeatureSet({ features: _shps })
        // gp.submitJob({ AOI_Polygon: featureSet }).then((jobInfo) => {
        //   const jobid = jobInfo.jobId;
        //   const options = {
        //     interval: 1500,
        //     statusCallback: (j) => {
        //       console.log('Job Status: ', j.jobStatus);
        //     }
        //   };

        //   gp.waitForJobCompletion(jobid, options).then(() => {
        //     gp.getResultData(jobid, 'Output_JSON').then((data) => {
        //       console.log(data, data.value);
        //       const outJson = JSON.parse(data.value)
        //       console.log(outJson)
        //     })
        //   })
        // });
        graphicsLayer.removeAll();
        graphicsLayer.addMany(_shps);
        createPNGForReport(new FeatureSet({features: graphicsLayer.graphics}));
      })

      this.mapControl.generateSummary$.subscribe((d) => {
        console.log('generate statistics')
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