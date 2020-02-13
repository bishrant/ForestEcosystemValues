
import GraphicsLayer from 'arcgis-js-api/layers/GraphicsLayer';

const createGraphicsLayer = () => {
    return new GraphicsLayer({
        id: 'userGraphicsLayer',
        symbol: {
            type: 'simple-marker',
            style: 'square',
            color: '#8A2BE2',
            size: '0px'
        }
    });
}

const MultiPointLayer = () => {
    return new GraphicsLayer({
        id: 'userGraphicsLayer',
        symbol: {
            type: 'simple-marker',
            style: 'diamond',
            size: 6,
            color: [255, 0, 0],
            outline: {
             color: [50, 50, 50],
              width: 1
            }
          }
    });
}

export {createGraphicsLayer, MultiPointLayer};