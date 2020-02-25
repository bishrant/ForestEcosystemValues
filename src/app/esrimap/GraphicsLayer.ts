
import GraphicsLayer from 'arcgis-js-api/layers/GraphicsLayer';
import { Polygon } from 'arcgis-js-api/geometry';
import Graphic from 'arcgis-js-api/Graphic';
import { emptyPoint, redDiamondMarker, redPolygon } from './renderers';

const createGraphicsLayer = () => {
    const graphicsLayer = new GraphicsLayer({
        id: 'userGraphicsLayer',
        symbol: emptyPoint
    });
    return graphicsLayer;
}

const MultiPointLayer = () => {
    return new GraphicsLayer({
        id: 'userGraphicsLayer',
        symbol: redDiamondMarker
    });
}

const createGraphicsFromShp = (shpFeatures: any) => {
    const _shps = [];
    shpFeatures.forEach((shp) => {
      const polgn = new Polygon({
        rings: shp.geometry.rings,
        spatialReference: shp.geometry.spatialReference.wkid
      })
      const gg = new Graphic({
        geometry: polgn,
        symbol: redPolygon.symbol,
        attributes: shp.attributes,
        popupTemplate: {}
      });
      _shps.push(gg);
    })
    return _shps;
}

export { createGraphicsLayer, MultiPointLayer, createGraphicsFromShp };