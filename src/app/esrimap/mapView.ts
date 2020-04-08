import { ElementRef } from '@angular/core';
import Map from 'arcgis-js-api/Map';
import MapView from 'arcgis-js-api/views/MapView';
import Search from 'arcgis-js-api/widgets/Search';
import SpatialReference from 'arcgis-js-api/geometry/SpatialReference';
import Home from 'arcgis-js-api/widgets/Home';
import BasemapGallery from 'arcgis-js-api/widgets/BasemapGallery';
import Expand from 'arcgis-js-api/widgets/Expand';

const createMapView = (mapViewEl: ElementRef) => {
  const mapProperties = {
    basemap: 'streets',
    spatialReference: new SpatialReference({ wkid: 4326 })
  };

  const map = new Map(mapProperties);

  // Initialize the MapView
  const mapViewProperties = {
    container: mapViewEl.nativeElement,
    center: [-99.5, 31.2],
    zoom: 6.5,
    snapToZoom: false,
    map
  };
  const view = new MapView(mapViewProperties);
  const search = new Search({ view });
  const basemapGallery = new BasemapGallery({ view });
  const homeWidget = new Home({view});
  view.ui.add(search, 'top-right');
  view.ui.move('zoom', 'bottom-right');
  view.ui.add(homeWidget, 'bottom-right');
  var bgExpand = new Expand({
    view: view,
    content: basemapGallery,
  });

  view.ui.add(bgExpand, 'bottom-right');
  return view;
}

export default createMapView;
