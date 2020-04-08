import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MapcontrolService } from '../services/mapcontrol.service';

@Component({
  selector: "app-printmap",
  templateUrl: "./printmap.component.html",
  styleUrls: ["./printmap.component.scss"],
})
export class PrintmapComponent implements OnInit {
  printInfo: any = { status: "inactive", message: "" };
  @Output() printingCompleted = new EventEmitter<any>();
  constructor(private mapControl: MapcontrolService) {}

  printMap = () => {
    this.mapControl.setPrintMapStatus("active", "");
  };
  ngOnInit() {
    this.mapControl.printMap$.subscribe((printInfo) => {
      this.printInfo = printInfo;
      if (this.printInfo.message !== "") {
        this.printingCompleted.emit(printInfo.message);
      }
    });
  }
}
