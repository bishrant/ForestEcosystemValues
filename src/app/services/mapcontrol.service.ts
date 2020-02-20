import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapcontrolService {
  private controlActivatedSource = new Subject<string>();
  private shapefileUploadSource = new Subject<any>();
  private activeLayers = new ReplaySubject<any>();
  private filterByCountyName = new ReplaySubject<any>();
  private filterByUrbanName = new ReplaySubject<any>();
  private mapExtent = new ReplaySubject<any>();

  private generateSummary = new ReplaySubject<any>();

  // observable streams
  controlActivated$ = this.controlActivatedSource.asObservable();
  shapefileUploaded$ = this.shapefileUploadSource.asObservable();
  generateSummary$ = this.generateSummary.asObservable();
  activeLayers$ = this.activeLayers.asObservable();
  filterByCountyName$ = this.filterByCountyName.asObservable();
  filterByUrbanName$ = this.filterByUrbanName.asObservable();
  mapExtent$ = this.mapExtent.asObservable();

  constructor() { }

  setMapExtent(extent: any) {
    this.mapExtent.next(extent);
  }

  applyCountyFilter(countyName: string) {
    this.filterByCountyName.next(countyName);
  }

  applyUrbanFilter(urbanName: string) {
    this.filterByUrbanName.next(urbanName);
  }

  changeControl(control: string) {
    this.controlActivatedSource.next(control);
  }

  deactivateControl(control: string) {
    this.controlActivatedSource.next(null);
  }

  shapefileUploaded(json: any) {
    this.shapefileUploadSource.next(json);
  }

  generateStatisticsFn() {
    this.generateSummary.next(Math.random())
  }

  changeActiveLayers(payload: any) {
    this.activeLayers.next(payload)
  }

}
