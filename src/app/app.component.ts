import { Component, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MapcontrolService } from './services/mapcontrol.service';
import { GeojsonDataService } from './services/geojson-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Forest Ecosystem Values';
  sidenavOpened = true;
  popupHidden = true
  @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
  constructor(private mapControl: MapcontrolService, private geoj: GeojsonDataService) {}

  ngAfterViewInit() {
    this.mapControl.generateSummary$.subscribe(() => {
      this.popupHidden = false;
    })
  }
}
