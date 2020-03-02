import { Component, OnInit } from '@angular/core';
import { MapcontrolService } from '../services/mapcontrol.service';

@Component({
  selector: 'app-printmap',
  templateUrl: './printmap.component.html',
  styleUrls: ['./printmap.component.scss']
})
export class PrintmapComponent implements OnInit {
  printInfo: any = {status: 'inactive', message: ''}
  constructor(private mapControl: MapcontrolService) { }

  printMap = () => {
    this.mapControl.setPrintMapStatus('active', '');
  }
  ngOnInit() {
    this.mapControl.printMap$.subscribe((printInfo) => {
      this.printInfo = printInfo;
    })
  }
}
