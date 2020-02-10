import { ElementRef } from '@angular/core';
import Map from 'arcgis-js-api/Map';
import MapView from 'arcgis-js-api/views/MapView';
import Search from 'arcgis-js-api/widgets/Search';
import Extent from 'arcgis-js-api/geometry/Extent';
import MapImageLayer from 'arcgis-js-api/layers/MapImageLayer';
import SpatialReference from 'arcgis-js-api/geometry/SpatialReference';

const createMapView = (mapViewEl: ElementRef) => {
  const fullExtent = new Extent({ xmin: -106.645646, ymin: 24.837377, xmax: -93.508292, ymax: 37.500704 }).expand(1.2);
  const countyLayer = new MapImageLayer({ url: 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/ForestProductsDirectory/FPDMapService/MapServer' });
  const mapProperties = {
    basemap: 'streets',
    layers: [countyLayer],
    spatialReference: new SpatialReference({ wkid: 4326 })
  };

  const map = new Map(mapProperties);

  // Initialize the MapView
  const mapViewProperties = {
    container: mapViewEl.nativeElement,
    extent: fullExtent,
    map
  };
  const view = new MapView(mapViewProperties);
  const search = new Search({ view });
  view.ui.add(search, 'top-right');
  view.ui.move('zoom', 'bottom-right');
  return view;
}

export default createMapView;