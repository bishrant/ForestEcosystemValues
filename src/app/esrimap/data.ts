import GeoJSONLayer from 'arcgis-js-api/layers/GeoJSONLayer';

const url = 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/ForestProductsDirectory/FPDMapService/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=6&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson';

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
const geojson = new GeoJSONLayer({ url: url, renderer: renderer });

export default geojson;