import { Component, OnInit, ViewChild } from '@angular/core';
import { MapcontrolService } from '../services/mapcontrol.service';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { GlobalsService } from '../services/globals.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  dataTable: any;
  @ViewChild('fileInput')
  fileInput;
  file: File | null = null;
  fileUploadError = '';
  panelOpenState = false;
  activeControl: string;
  mapHasUserGraphics = false;
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
  layers: any = [];
  getSubLayers = (master: any, layers: any) => {
    return layers.filter(l => l.parentLayerId === master.id);
  }

  // Click event on parent checkbox
  parentCheck(masterLayer: any) {
    masterLayer.subLayers.forEach((s: any) => {
      s.defaultVisibility = masterLayer.defaultVisibility;
    })
    this.mapControl.changeActiveLayers(this.dataTable);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // Click event on child checkbox
  childCheck(masterLayer, subLayer) {
    masterLayer.defaultVisibility = subLayer.every((c: any) => {
      return c.defaultVisibility === true;
    })
    this.mapControl.changeActiveLayers(this.dataTable);
  }
  createLayerList = () => {
    this.http.get(this.globals.arcgisUrl + 'services/ForestEcosystemValues/ForestValues/MapServer?f=json').subscribe((datas: any) => {
      const headings = datas.layers.filter(l => l.subLayerIds !== null);
      const d = headings.map((h: any) => {
        h.subLayers = this.getSubLayers(h, datas.layers);
        h.visible = h.defaultVisibility;
        return h;
      })
      this.dataTable = d;
      this.mapControl.changeActiveLayers(this.dataTable);
    })
  }

  constructor(private globals: GlobalsService, private mapControl: MapcontrolService,
    private http: HttpClient, private store: Store) {
    }

  ngOnInit() {
    this.createLayerList();
    this.mapControl.graphicsLayerStatus$.subscribe((evt: any) => {
      this.mapHasUserGraphics = evt.target.length > 0;
    });

    this.mapControl.spatialSelectionState$.subscribe((state: any) => {
      this.spatialSelectionState = state;
    })
  }

  onControlChange = (evt: any) => {
    this.removeShapeFile();
    this.mapControl.changeControl(evt)
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  generateStatistics() {
    this.mapControl.generateStatisticsFn();
  }

  startSpatialSelection = (controlName: string, action: string) => {
    this.mapControl.startSpatialSelection(controlName, action);
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];

    const form = new FormData();
    const publishParams: any = {
      targetSR: {
        wkid: 102100
      },
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
          this.shapefileControlState ={ start: false, cancel: true};
          console.log('feature uploaded')
          this.mapControl.shapefileUploaded(features);
        } else {
          this.fileUploadError = '';
        }
      }
    }, (e) => {
      console.log(e);
      this.fileUploadError = 'Error parsing shapefile.'
    })
  }

  removeShapeFile = () => {
    this.shapefileControlState = {start: true, cancel: false};
    this.mapControl.clearGraphics();
  }
}
