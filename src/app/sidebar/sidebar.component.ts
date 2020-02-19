import { Component, OnInit, ViewChild } from '@angular/core';
import { MapcontrolService } from '../services/mapcontrol.service';
import { HttpClient } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { ChangeControl, ChangeActiveLayers } from '../shared/sidebarControls.actions';
import { SidebarControlsState } from '../shared/sidebarControls.state';

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
  layers: any = [];

  mapserverUrl = 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/ForestEcosystemValues/ForestValues/MapServer';

  getSubLayers = (master: any, layers: any) => {
    return layers.filter(l => l.parentLayerId === master.id);
  }

  // Click event on parent checkbox
  parentCheck(masterLayer: any) {
    console.log('parent check done')
    const d = this.dataTable.map(dd => {
      if (dd.id === masterLayer.id) {
        dd.subLayers.forEach((s: any) => {
          s.defaultVisibility = masterLayer.defaultVisibility;
        })
      }
      return dd;
    });
    console.log(d);
    masterLayer.subLayers.forEach((s: any) => {
      s.defaultVisibility = masterLayer.defaultVisibility;
    })
    console.log(this.dataTable)
    // this.store.dispatch(new ChangeActiveLayers(this.dataTable))
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // Click event on child checkbox
  childCheck(masterLayer, subLayer) {
    masterLayer.defaultVisibility = subLayer.every((c: any) => {
      return c.defaultVisibility === true;
    })
  }
  createLayerList = (url: string = this.mapserverUrl + '?f=json') => {
    this.http.get(url).subscribe((datas: any) => {
      const headings = datas.layers.filter(l => l.subLayerIds !== null);
      const d = headings.map((h: any) => {
        h.subLayers = this.getSubLayers(h, datas.layers);
        h.visible= h.defaultVisibility;
        return h;
      })
      this.dataTable = d;
      // this.store.dispatch(new ChangeActiveLayers(d));
    })
  }

  constructor(private mapControl: MapcontrolService, private http: HttpClient, private store: Store) { }
  ngOnInit() {
    this.createLayerList();
  }

  onControlChange = (evt: any) => {
    this.store.dispatch(new ChangeControl(evt))
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  generateStatistics() {
    this.mapControl.generateStatisticsFn();
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


}
