import Extent from 'arcgis-js-api/geometry/Extent';

const fullExtent = new Extent({ xmin: -106.645646, ymin: 24.837377, xmax: -93.508292, ymax: 37.500704 }).expand(1.2);

export {fullExtent};