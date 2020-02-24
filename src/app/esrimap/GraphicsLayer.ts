
import GraphicsLayer from 'arcgis-js-api/layers/GraphicsLayer';
import { emptyPoint, redDiamondMarker } from './renderers';

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

export { createGraphicsLayer, MultiPointLayer };