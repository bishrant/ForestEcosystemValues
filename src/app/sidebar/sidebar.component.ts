import { Component, OnInit, ViewChild } from '@angular/core';
import { MapcontrolService } from '../services/mapcontrol.service';
import { HttpClient } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { ChangeControl } from '../shared/sidebarControls.actions';
import { SidebarControlsState } from '../shared/sidebarControls.state';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelOpenState = false;
  activeControl: string;
  @ViewChild('fileInput')
  fileInput;
  file: File | null = null;
  fileUploadError = '';
  @Select(SidebarControlsState.getControl) sidebar$;

  constructor(private mapControl: MapcontrolService, private http: HttpClient, private store: Store) { }

  ngOnInit() {
    // this.sidebar$.
    this.sidebar$.subscribe(d => console.log(d))
  }

  onControlChange = (evt: any) => {
    this.store.dispatch(new ChangeControl(evt))
    // this.mapControl.changeControl(evt);
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  generateStatistics() {
    console.log()
    // this.sidebar$.change('testsss')
    // this.mapControl.generateStatisticsFn();
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
