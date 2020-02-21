import MapView from 'arcgis-js-api/views/MapView';
import SketchViewModel from 'arcgis-js-api/widgets/Sketch/SketchViewModel';
import Point from 'arcgis-js-api/geometry/Point';
import { redPolygon } from './renderers';

const setupSketchViewModel = (graphicsLayer: any, mapView: MapView) => {
    const skView = new SketchViewModel({
        view: mapView,
        layer: graphicsLayer,
        pointSymbol: {
            type: 'simple-marker',
            style: 'square',
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

const SelectMultipleCounties = async (event: any, geojson: any, _graphicsLayer: any) => {
    const total = event.graphic.geometry.points.length;
    const lastGeom = event.graphic.geometry.points[total - 1];
    const newPt = new Point({ x: lastGeom[0], y: lastGeom[1], spatialReference: { wkid: 3857 } });
    if (event.tool !== 'multipoint') return;
    return geojson.queryFeatures({
        geometry: newPt,
        spatialRelationship: 'intersects',
        returnGeometry: true,
        maxRecordCount: 0,
        outFields: ['NAME']
    }).then((results) => {
        let existingCounties = [];
        if (_graphicsLayer.graphics.length > 0) existingCounties = _graphicsLayer.graphics.map((f) => { return f.attributes.NAME }).items;
        const features = results.features.map((graphic) => {
            graphic.symbol = redPolygon.symbol;
            return graphic;
        });

        const featureFilter = features[0];
        if (existingCounties.indexOf(featureFilter.attributes.NAME) === -1) {
            _graphicsLayer.add(featureFilter);
        } else {
            const _g = _graphicsLayer.graphics.filter((g) => { return g.attributes.NAME === featureFilter.attributes.NAME })
            _graphicsLayer.remove(_g);
        }
    });
}

const SelectByPolygon = async (event: any, geojson: any, _graphicsLayer: any) => {

    return geojson.queryFeatures({
        geometry: event.graphic.geometry,
        spatialRelationship: 'intersects',
        returnGeometry: true,
        maxRecordCount: 0,
        outFields: ['NAME']
    }).then((results) => {
        let existingCounties = [];
        if (_graphicsLayer.graphics.length > 0) existingCounties = _graphicsLayer.graphics.map((f) => { return f.attributes.NAME }).items;
        const features = results.features.map((graphic) => {
            graphic.symbol = redPolygon.symbol;
            return graphic;
        });
        _graphicsLayer.removeAll();
        _graphicsLayer.addMany(features);
    });
}

export { setupSketchViewModel, selectCounties, SelectMultipleCounties, SelectByPolygon };