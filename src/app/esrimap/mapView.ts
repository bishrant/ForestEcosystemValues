import { ElementRef } from '@angular/core';
import Map from 'arcgis-js-api/Map';
import MapView from 'arcgis-js-api/views/MapView';
import Search from 'arcgis-js-api/widgets/Search';
import SpatialReference from 'arcgis-js-api/geometry/SpatialReference';
import { fullExtent } from './Variables';

const createMapView = (mapViewEl: ElementRef) => {
  // const fullExtent = new Extent({ xmin: -106.645646, ymin: 24.837377, xmax: -93.508292, ymax: 37.500704 }).expand(1.2);
  const mapProperties = {
    basemap: 'streets',
    spatialReference: new SpatialReference({ wkid: 4326 })
  };

  const map = new Map(mapProperties);

  // Initialize the MapView
  const mapViewProperties = {
    container: mapViewEl.nativeElement,
    extent: fullExtent,
    snapToZoom: false,
    map
  };
  const view = new MapView(mapViewProperties);
  const search = new Search({ view });
  view.ui.add(search, 'top-right');
  view.ui.move('zoom', 'bottom-right');
  return view;
}

export default createMapView;