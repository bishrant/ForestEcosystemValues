import { Component, ViewChild, AfterViewInit, TemplateRef, AfterContentInit, Inject } from '@angular/core';
import { MapcontrolService } from './services/mapcontrol.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  constructor(private mapControl: MapcontrolService, private dialog: MatDialog) {}

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

  openDialog = (type: string) => {
    console.log(type);
    const ref = this.dialog.open(AppDialogComponent, {data: {type: type}})
  }
}

@Component({
  selector: 'appdialog',
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