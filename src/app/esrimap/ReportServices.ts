import Geoprocessor from 'arcgis-js-api/tasks/Geoprocessor';
import FeatureSet = require('arcgis-js-api/tasks/support/FeatureSet');

const arcgisServer = 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/'
const reportGP: any = Geoprocessor(arcgisServer + 'services/ForestEcosystemValues/CalculateForestValues/GPServer/CalculateForestValues');
reportGP.outSpatialReference = { wkid: 102100 };
const printGP: any = Geoprocessor(arcgisServer + 'services/ForestEcosystemValues/ExportReportImage/GPServer/ExportReportImage');

const createFeatureSet = (graphicsArray: any) => {
    const fs = []
    graphicsArray.forEach((g: any) => {
        if (g.geometry.type === 'polygon') fs.push(g)
    });
    const featureSet = new FeatureSet({ features: fs, geometryType: 'polygon', spatialReference: { wkid: 102100 } });
    return featureSet;

}

const createPNGForReport = async (graphicsArray: any) => {
    const featureSet = createFeatureSet(graphicsArray);
    return new Promise((resolve: any, reject: any) => {
        printGP.submitJob({ polygon: featureSet }).then((jobInfo) => {
            const jobid = jobInfo.jobId;
            const options = { interval: 500 };
            printGP.waitForJobCompletion(jobid, options).then(() => {
                printGP.getResultData(jobid, 'output').then((data) => {
                    const imgPth = data.value.replace('e:\\arcgisserver', arcgisServer).replace(/\\/g, '/')
                    resolve(imgPth);
                })
            })
        });
    })
}

const getReportValues = async (graphicsArray: any) => {
    const featureSet = createFeatureSet(graphicsArray);
    return new Promise((resolve: any, reject: any) => {
        reportGP.submitJob({ AOI_Polygon: featureSet }).then((jobInfo) => {
            const jobid = jobInfo.jobId;
            const options = { interval: 500 };

            reportGP.waitForJobCompletion(jobid, options).then(() => {
                reportGP.getResultData(jobid, 'Output_JSON').then((data) => {
                    resolve(JSON.parse(data.value))
                })
            })
        });
    })
}

export { createPNGForReport, getReportValues }