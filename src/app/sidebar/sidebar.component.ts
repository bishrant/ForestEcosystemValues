import { Component, OnInit, ViewChild } from '@angular/core';
import { MapcontrolService } from '../services/mapcontrol.service';
import { HttpClient } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { getReportValues, createPNGForReport } from '../esrimap/ReportServices';
import { ChangeReportData } from '../shared/sidebarControls.actions';
import { SidebarControlsState } from '../shared/sidebarControls.state';
import { TourService } from 'ngx-tour-md-menu';
import { dummyReportData } from '../esrimap/Variables';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Select(SidebarControlsState.getReportDataFromState) reportData$;
  @ViewChild('fileInput') fileInput;
  @ViewChild('accordion') sidePanels;
  pdfLink = '';
  reportData: any;
  printBtnEnabled = false;
  reportEnabled = false;
  file: File | null = null;
  fileUploadError = '';
  panelOpenState = false;
  activeControl: string;
  mapGraphics: any[] = [];
  spatialSelectionState = {
    multipoint: false,
    multipointDisabled: false,
    polygon: false,
    polygonDisabled: false
  }
  shapefileControlState = {
    start: true,
    cancel: null
  }
  step = 0;
  constructor(private mapControl: MapcontrolService, private http: HttpClient, private store: Store,
    public tourService: TourService
    ) { }

  ngOnInit() {
    this.mapControl.graphicsLayerStatus$.subscribe((gLayer: any) => {
      this.mapGraphics = gLayer.graphics;
      this.reportEnabled = this.mapGraphics.length > 0;
    });

    this.mapControl.spatialSelectionState$.subscribe((state: any) => {
      this.spatialSelectionState = state;
    })

    this.reportData$.subscribe(dt => {
      if (dt !== null) { this.printBtnEnabled = true; }
      else {if (this.printBtnEnabled) {this.printBtnEnabled = false}}
      this.reportData = dt;
    });
    this.tourService.stepShow$.subscribe((step: any) => {
      if (step.anchorId === 'generateStatisticsBtn') {
        this.store.dispatch(new ChangeReportData(dummyReportData));
      }
    });
    this.tourService.start$.subscribe(() => {
      this.sidePanels.openAll();
    })
    this.tourService.end$.subscribe(() => {
      this.sidePanels.closeAll();
      this.store.dispatch(new ChangeReportData(null));
    })
    this.store.dispatch(new ChangeReportData(dummyReportData));
  }

  onControlChange = (evt: any) => {
    this.reportEnabled = false;
    this.removeShapeFile();
    this.mapControl.changeControl(evt)
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  startTour = () => this.mapControl.startTour();

  generateStatistics = () => {
    this.mapControl.setAppBusyIndicator(true);
    getReportValues(this.mapGraphics).then((v) => {
      this.store.dispatch(new ChangeReportData(v));
      this.mapControl.setAppBusyIndicator(false);
    })
  }

  startSpatialSelection = (controlName: string, action: string) => {
    if (action === 'clear') {
      this.reportEnabled = false;
      this.store.dispatch(new ChangeReportData(null));
    }
    this.mapControl.startSpatialSelection(controlName, action);
  }

  generateReport = () => {
    this.mapControl.setAppBusyIndicator(true);
    createPNGForReport(this.mapGraphics).then((_mapURL) => {
      const body = JSON.stringify({
        mapURL: _mapURL,
        stats: this.reportData
      });
      const reportSubscription = this.http.post('https://txfipdev.tfs.tamu.edu/forestecosystemvalues/api/createreport', body, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe((dd: any) => {
        this.pdfLink = dd.fileName;
        this.mapControl.setAppBusyIndicator(false);
      });
      reportSubscription.add(() => this.mapControl.setAppBusyIndicator(false))
    })
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    const form = new FormData();
    const publishParams: any = {
      targetSR: {wkid: 102100},
      maxRecordCount: 1000,
      enforceInputFileSizeLimit: true,
      enforceOutputJsonSizeLimit: true
    };
    publishParams.generalize = false;
    publishParams.reducePrecision = false;
    publishParams.numberOfDigitsAfterDecimal = 0;
    form.append('publishParameters', JSON.stringify(publishParams));
    form.append('filetype', 'shapefile');
    form.append('f', 'json');
    form.append('file', this.file);
    this.http.post('https://www.arcgis.com/sharing/rest/content/features/generate', form).subscribe((result: any) => {
      if (typeof result.error !== 'undefined') {
        this.fileUploadError = 'Error parsing shapefile.';
        this.activeControl = null;
      } else {
        this.fileUploadError = '';
        const features = [];
        result.featureCollection.layers.forEach((layer) => {
          const type = layer.layerDefinition.geometryType;
          if (type === 'esriGeometryPolygon') {
            layer.featureSet.features.forEach((feature) => {
              features.push(feature);
            });
          }
        })
        if (features.length > 0) {
          this.shapefileControlState = { start: false, cancel: true };
          this.mapControl.shapefileUploaded(features);
        } else {
          this.fileUploadError = '';
        }
      }
    }, (e) => {
      this.fileUploadError = 'Error parsing shapefile.'
    })
  }

  removeShapeFile = () => {
    this.store.dispatch(new ChangeReportData(null))
    this.shapefileControlState = { start: true, cancel: false };
    this.mapControl.clearGraphics();
  }
}

