import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapcontrolService {
  private defaultSelectionState = {multipoint: false, polygon: false, multipointDisabled: false, polygonDisabled: false}
  private controlActivatedSource = new Subject<string>();
  private shapefileUploadSource = new Subject<any>();
  private activeLayers = new ReplaySubject<any>();
  private filterByCountyName = new ReplaySubject<any>();
  private filterByUrbanName = new ReplaySubject<any>();
  private mapExtent = new ReplaySubject<any>();
  private startSpatialSelectionSource = new BehaviorSubject<any>(null);
  private graphicsLayerStatus = new ReplaySubject<any>();
  private generateSummary = new ReplaySubject<any>();
  private spatialSelectionState = new BehaviorSubject<any>(this.defaultSelectionState);

  // observable streams
  controlActivated$ = this.controlActivatedSource.asObservable();
  shapefileUploaded$ = this.shapefileUploadSource.asObservable();
  generateSummary$ = this.generateSummary.asObservable();
  activeLayers$ = this.activeLayers.asObservable();
  filterByCountyName$ = this.filterByCountyName.asObservable();
  filterByUrbanName$ = this.filterByUrbanName.asObservable();
  mapExtent$ = this.mapExtent.asObservable();
  startSpatialSelection$ = this.startSpatialSelectionSource.asObservable();
  graphicsLayerStatus$ = this.graphicsLayerStatus.asObservable();
  spatialSelectionState$ = this.spatialSelectionState.asObservable();

  constructor() { }

  graphicsLayerUpdated = (evt: any) => {this.graphicsLayerStatus.next(evt)}
  setMapExtent(extent: any) {
    this.mapExtent.next(extent);
  }

  applyCountyFilter(countyName: string) {
    this.filterByCountyName.next(countyName);
  }

  applyUrbanFilter(urbanName: string) {
    this.filterByUrbanName.next(urbanName);
  }

  setSpatialSelectionState = (controlName: string, status: boolean) => {
    const _v = this.spatialSelectionState.getValue();
    _v[controlName] = status;
    this.spatialSelectionState.next(_v);
  }

  drawingCompleted = (controlName: string, status: boolean) => {
    const _v = this.spatialSelectionState.getValue();
    _v[controlName + 'Disabled'] = status;
    this.spatialSelectionState.next(_v);
  }

  changeControl(control: string) {
    this.spatialSelectionState.next(this.defaultSelectionState);
    this.controlActivatedSource.next(control);
    this.setSpatialSelectionState('multipoint', false);
    this.setSpatialSelectionState('polygon', false);
    this.setSpatialSelectionState('multipointDisabled', false);
    this.setSpatialSelectionState('polygonDisabled', false);

    this.startSpatialSelectionSource.next({current: 'multipoint', previous: 'multipoint', action:'clear'});
  }

  deactivateControl(control: string) {
    this.controlActivatedSource.next(null);
  }

  startSpatialSelection = (control: string, action: string) => {
    const last = this.startSpatialSelectionSource.getValue();
    let _action = action;
    if (_action === 'clear') {
      this.drawingCompleted(control, false);
    }
    if (this.spatialSelectionState.getValue()[control]) {_action = 'clear'};
    this.setSpatialSelectionState(control, _action === 'start' ? true: false);
    this.startSpatialSelectionSource.next({current: control, previous: last ? last.current: null, action: _action});
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
