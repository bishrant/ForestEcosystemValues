import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointincountyService {
  pointInCountyDataService = new ReplaySubject<object>(1);
  pointInCountyData = new ReplaySubject<object>(1);
  selectedCountiesGeom = new ReplaySubject<object>(1);
  constructor(private http: HttpClient) { }
  public getCountyNameFromPoint(geom) {
    const body = `f=geojson&where=1=1&outfields=name&geometry=${geom}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryMultipoint&returnGeometry=false`;

    this.http.post('https://services5.arcgis.com/ELI1iJkCzTIagHkp/ArcGIS/rest/services/TXCounties/FeatureServer/0/query', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).subscribe(data => {
      const features = data['features'];
      const counties = [];
      if (features.length > 0) {
        features.forEach((f) => {
          counties.push(f['properties']['NAME']);
        });
      }
      this.pointInCountyDataService.next(counties);
    });
  }

  public getCountiesGeometry(geom) {
    // function to return geometry of counties given a list of points
    const body = `f=geojson&where=1=1&outfields=*&geometry=${geom}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryPoint&returnGeometry=true&geometryPrecision=0`;

   return this.http.post('https://services5.arcgis.com/ELI1iJkCzTIagHkp/ArcGIS/rest/services/counties4/FeatureServer/0/query', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }
}
