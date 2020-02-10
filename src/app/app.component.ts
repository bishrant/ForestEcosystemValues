import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Forest Ecosystem Values';
  sidenavOpened = true;
  constructor(private http: HttpClient) {}
  fileUpload = (file) => {

    const form = new FormData();
    const publishParams: any = {
        targetSR: {
            wkid: 102100
        },
        maxRecordCount: 1000,
        enforceInputFileSizeLimit: true,
        enforceOutputJsonSizeLimit: true
    };
    publishParams.generalize = false;
    publishParams.reducePrecision = false;
    publishParams.numberOfDigitsAfterDecimal = 0;
    form.append('publishParameters', JSON.stringify(publishParams));
    form.append('filetype', 'shapefile');
    form.append('f', 'json');
    form.append('file', file);
    this.http.post('https://www.arcgis.com/sharing/rest/content/features/generate', form).subscribe((ff) => {
      console.log(ff);
    })
  }
}
