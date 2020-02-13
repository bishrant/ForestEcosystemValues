import { Component, ViewChild, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import { MapcontrolService } from './services/mapcontrol.service';

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
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;
  
  constructor(private _overlay: Overlay, private _viewContainerRef: ViewContainerRef, private mapControl: MapcontrolService) {}

  ngAfterViewInit() {
    this.mapControl.generateSummary$.subscribe(() => {
      this.popupHidden = false;
    })
  }
}
