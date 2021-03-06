import { Component, ViewChild, AfterViewInit, TemplateRef, AfterContentInit, Inject, OnInit } from '@angular/core';
import { MapcontrolService } from './services/mapcontrol.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TourService } from 'ngx-tour-md-menu';
import tourSteps from './shared/tourSteps';
import { Select, Store } from "@ngxs/store";
import { SidebarControlsState } from './shared/sidebarControls.state';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit, AfterContentInit, OnInit {
  title = "Forest Ecosystem Values";
  sidenavOpened = true;
  popupHidden = true;
  appBusy = true;
  @Select(SidebarControlsState.getReportDataFromState) reportData$: any;
  constructor(
    private mapControl: MapcontrolService,
    private dialog: MatDialog,
    public tourService: TourService,
    private store: Store
  ) {}

  ngAfterViewInit() {
    this.mapControl.generateSummary$.subscribe(() => {
      this.popupHidden = false;
    });
  }
  ngAfterContentInit() {
    this.appBusy = false;
    this.mapControl.appBusyIndicator$.subscribe((status: boolean) => {
      this.appBusy = status;
    });
    this.reportData$.subscribe((dt: any) => {
      if (dt.data === null) {
        this.popupHidden = true;
      } else {
        this.popupHidden = false;
      }
    });
  }

  openDialog = (type: any) => {
    if (type === "help") {
      this.tourService.start();
    } else {
      this.dialog.open(AppDialogComponent, { data: { type } });
    }
  };

  openPrintMessage = (data: any) => {
    this.dialog.open(AppDialogComponent, { data });
  };

  ngOnInit() {
    this.tourService.initialize(tourSteps);
    this.mapControl.startTour$.subscribe(() => this.tourService.start());
  }
  }


@Component({
  selector: 'app-appdialog',
  templateUrl: 'shared/appdialog.html'
})
export class AppDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  close(): void {
    this.dialogRef.close();
  }
}
