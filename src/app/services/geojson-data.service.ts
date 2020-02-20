import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import GeoJSONLayer from 'arcgis-js-api/layers/GeoJSONLayer';

@Injectable({
  providedIn: 'root'
})
export class GeojsonDataService {
  countyGeojsonLayer: any;
  constructor(private globals: GlobalsService) {
    const url = 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/ForestEcosystemValues/ForestValues/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=6&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson';

    const renderer = {
      type: 'simple',
      symbol: {
        type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
        color: 'transparent',
        style: 'solid',
        outline: {  // autocasts as new SimpleLineSymbol()
          color: 'black',
          width: 1
        }
      }
    }
    this.countyGeojsonLayer = new GeoJSONLayer({ url: url, renderer: renderer, visible: false });
  }
}
