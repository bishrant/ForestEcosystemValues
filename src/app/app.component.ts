import { Component, ViewChild, AfterViewInit, TemplateRef, AfterContentInit } from '@angular/core';
import { MapcontrolService } from './services/mapcontrol.service';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, AfterContentInit  {
  title = 'Forest Ecosystem Values';
  sidenavOpened = true;
  popupHidden = true
  appBusy = true;
  @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
  constructor(private mapControl: MapcontrolService, private overlay: Overlay) {}

  ngAfterViewInit() {
    this.mapControl.generateSummary$.subscribe(() => {
      this.popupHidden = false;
    })
    
    //  this.overlay.create({
    //   positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    //   hasBackdrop: true
    // }).attach(new ComponentPortal(AppComponent))

  }
  ngAfterContentInit() {
    this.appBusy = false;

    this.mapControl.appBusyIndicator$.subscribe((status: boolean) => {
      this.appBusy = status;
    })
  }

}
