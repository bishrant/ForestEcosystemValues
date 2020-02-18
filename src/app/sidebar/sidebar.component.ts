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
  data: any;

  getSubLayers = (master: any, layers: any) => {
    return layers.filter(l => l.parentLayerId === master.id);
  }

  // Click event on parent checkbox 
  parentCheck(masterLayer) {
    masterLayer.subLayers.forEach((s: any) => {
      s.defaultVisibility = masterLayer.defaultVisibility;
    })
  }

  // Click event on child checkbox  
  childCheck(masterLayer, subLayer) {
    masterLayer.defaultVisibility = subLayer.every((c: any) => {
      return c.defaultVisibility === true;
    })
  }
  createLayerList = (url: string = this.mapserverUrl + '?f=json') => {
    this.http.get(url).subscribe((data: any) => {
      const layers = data.layers;
      const headings = layers.filter(l => l.subLayerIds !== null);

      const newMaster = headings.map((h: any) => {
        h.subLayers = this.getSubLayers(h, layers);
        return h;
      })
      this.data = newMaster;
    })
  }
  panelOpenState = false;
  activeControl: string;
  @ViewChild('fileInput')
  fileInput;
  file: File | null = null;
  fileUploadError = '';
  mapserverUrl = 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/ForestEcosystemValues/ForestValues/MapServer';
  @Select(SidebarControlsState.getControl) sidebar$;

  layerHeadings: any = [
    {id: 0, name: 'Boundaries'},
    {id: 6, name: 'Forests'},
    {id: 10, name: 'Forest Ecosystem Values'}];

  layers: any = [];
  constructor(private mapControl: MapcontrolService, private http: HttpClient, private store: Store) { }


  ngOnInit() {
    // this.sidebar$.
    this.createLayerList();
    this.sidebar$.subscribe(d => console.log(d))

    const createLayerList = (url: string) => {
      this.http.get(url).subscribe((data: any) => {
        console.log(data);
        this.layers = data.layers;
        const headings = this.layers.filter(l => l.subLayerIds !== null);
        console.log(headings);
      })
    }

    createLayerList(this.mapserverUrl+'?f=pjson');
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
