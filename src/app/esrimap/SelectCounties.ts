import MapView from 'arcgis-js-api/views/MapView';
import SketchViewModel from 'arcgis-js-api/widgets/Sketch/SketchViewModel';
import Point from 'arcgis-js-api/geometry/Point';

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
            graphic.symbol = {
                type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
                color: 'transparent',
                style: 'solid',
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: 'red',
                    width: 3
                }
            };
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
            graphic.symbol = {
                type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
                color: 'transparent',
                style: 'solid',
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: 'red',
                    width: 3
                }
            };
            return graphic;
        });
        _graphicsLayer.removeAll();
        _graphicsLayer.addMany(features);
    });
}

const fff2 = {
    'featureCollection': {
      'layers': [
        {
          'layerDefinition': {
            'currentVersion': 10.7,
            'id': 0,
            'name': 'POLYGON',
            'type': 'Feature Layer',
            'displayField': '',
            'description': '',
            'copyrightText': '',
            'defaultVisibility': true,
            'relationships': [
              
            ],
            'isDataVersioned': false,
            'supportsAppend': true,
            'supportsCalculate': true,
            'supportsASyncCalculate': true,
            'supportsTruncate': false,
            'supportsAttachmentsByUploadId': true,
            'supportsAttachmentsResizing': true,
            'supportsRollbackOnFailureParameter': true,
            'supportsStatistics': true,
            'supportsExceedsLimitStatistics': true,
            'supportsAdvancedQueries': true,
            'supportsValidateSql': true,
            'supportsCoordinatesQuantization': true,
            'supportsFieldDescriptionProperty': true,
            'supportsQuantizationEditMode': true,
            'supportsApplyEditsWithGlobalIds': false,
            'supportsMultiScaleGeometry': true,
            'supportsReturningQueryGeometry': true,
            'advancedQueryCapabilities': {
              'supportsPagination': true,
              'supportsPaginationOnAggregatedQueries': true,
              'supportsQueryRelatedPagination': true,
              'supportsQueryWithDistance': true,
              'supportsReturningQueryExtent': true,
              'supportsStatistics': true,
              'supportsOrderBy': true,
              'supportsDistinct': true,
              'supportsQueryWithResultType': true,
              'supportsSqlExpression': true,
              'supportsAdvancedQueryRelated': true,
              'supportsCountDistinct': true,
              'supportsPercentileStatistics': true,
              'supportsReturningGeometryCentroid': true,
              'supportsReturningGeometryProperties': true,
              'supportsQueryWithDatumTransformation': true,
              'supportsHavingClause': true,
              'supportsOutFieldSQLExpression': true,
              'supportsMaxRecordCountFactor': true,
              'supportsTopFeaturesQuery': true,
              'supportsDisjointSpatialRel': true,
              'supportsQueryWithCacheHint': true
            },
            'useStandardizedQueries': false,
            'geometryType': 'esriGeometryPolygon',
            'minScale': 0,
            'maxScale': 0,
            'extent': {
              'xmin': -1.2719121506653327E7,
              'ymin': 3287403.7124888604,
              'xmax': -9783939.620502561,
              'ymax': 5165920.119625353,
              'spatialReference': {
                'wkid': 102100,
                'latestWkid': 3857
              }
            },
            'drawingInfo': {
              'renderer': {
                'type': 'simple',
                'symbol': {
                  'type': 'esriSFS',
                  'style': 'esriSFSSolid',
                  'color': [
                    76,
                    129,
                    205,
                    191
                  ],
                  'outline': {
                    'type': 'esriSLS',
                    'style': 'esriSLSSolid',
                    'color': [
                      0,
                      0,
                      0,
                      255
                    ],
                    'width': 0.75
                  }
                }
              },
              'transparency': 0,
              'labelingInfo': null
            },
            'allowGeometryUpdates': true,
            'hasAttachments': false,
            'htmlPopupType': '',
            'hasM': false,
            'hasZ': false,
            'objectIdField': 'FID',
            'globalIdField': '',
            'typeIdField': '',
            'fields': [
              {
                'name': 'FID',
                'type': 'esriFieldTypeOID',
                'alias': 'FID',
                'sqlType': 'sqlTypeOther',
                'nullable': false,
                'editable': false,
                'domain': null,
                'defaultValue': null
              }
            ],
            'indexes': [
              
            ],
            'types': [
              
            ],
            'templates': [
              {
                'name': 'New Feature',
                'description': '',
                'drawingTool': 'esriFeatureEditToolPolygon',
                'prototype': {
                  'attributes': {
                    
                  }
                }
              }
            ],
            'supportedQueryFormats': 'JSON, geoJSON',
            'hasStaticData': false,
            'maxRecordCount': -1,
            'standardMaxRecordCount': 4000,
            'standardMaxRecordCountNoGeometry': 32000,
            'tileMaxRecordCount': 4000,
            'maxRecordCountFactor': 1,
            'capabilities': 'Create,Delete,Query,Update,Editing'
          },
          'featureSet': {
            'features': [
              {
                'attributes': {
                  'FID': 0
                },
                'geometry': {
                  'spatialReference': {
                    'wkid': 102100,
                    'latestWkid': 3857
                  },
                  'rings': [
                    [
                      [
                        -1.27191215066533E7,
                        3287403.71248886
                      ],
                      [
                        -9783939.62050256,
                        3287403.71248886
                      ],
                      [
                        -9783939.62050256,
                        5165920.11962535
                      ],
                      [
                        -1.27191215066533E7,
                        5165920.11962535
                      ],
                      [
                        -1.27191215066533E7,
                        3287403.71248886
                      ]
                    ]
                  ]
                }
              }
            ],
            'geometryType': 'esriGeometryPolygon'
          }
        }
      ],
      'showLegend': true
    }
  }

  const fff =  [
    {
      'attributes': {
        'FID': 0
      },
      'geometry': {
        'spatialReference': {
          'wkid': 102100,
          'latestWkid': 3857
        },
        'rings': [
          [
            [
              -1.27191215066533E7,
              3287403.71248886
            ],
            [
              -9783939.62050256,
              3287403.71248886
            ],
            [
              -9783939.62050256,
              5165920.11962535
            ],
            [
              -1.27191215066533E7,
              5165920.11962535
            ],
            [
              -1.27191215066533E7,
              3287403.71248886
            ]
          ]
        ]
      }
    }
  ]

 
export { setupSketchViewModel, selectCounties, SelectMultipleCounties, SelectByPolygon, fff };