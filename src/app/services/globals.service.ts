import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  readonly arcgisUrl: string = 'https://tfsgis.tfs.tamu.edu/arcgis/rest/';
  constructor() { }
}
