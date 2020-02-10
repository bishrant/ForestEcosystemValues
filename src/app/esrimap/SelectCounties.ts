import MapView from 'arcgis-js-api/views/MapView';
import SketchViewModel from 'arcgis-js-api/widgets/Sketch';
import Point from 'arcgis-js-api/geometry/Point';

const setupSketchViewModel = (graphicsLayer: any, mapView: MapView) => {
    const skView = new SketchViewModel({
        view: mapView,
        layer: graphicsLayer,
        pointSymbol: {
            type: 'simple-marker',
            style: 'circle',
            color: '#8A2BE2',
            size: '0px'
        },
        updateOnGraphicClick: false
    });

    return skView;
}

const selectCounties = (inputGeom: any, service: any) => {
    const clonePtGeom = inputGeom.points[inputGeom.points.length - 1];
    const newlyaddedPt = new Point({
        x: clonePtGeom[0],
        y: clonePtGeom[1],
        spatialReference: { wkid: 3857 }
    });

    service.getCountiesGeometry(JSON.stringify(newlyaddedPt.toJSON())).subscribe(d => {
        console.log(d);
    });
}

export { setupSketchViewModel, selectCounties };