import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule} from '@angular/flex-layout';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EsrimapComponent } from './esrimap/esrimap.component';
import { AllMaterialModule } from './material.module';
import { SummarytableModule } from './summarytable/summarytable.module';
import { OverlayModule } from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { SidebarControlsState } from './shared/sidebarControls.state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { GlobalsService } from './services/globals.service';
import { GeojsonDataService } from './services/geojson-data.service';
import { CountylistModule } from './sidebar/countylist/countylist.module';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    EsrimapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    ScrollingModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule,
    AllMaterialModule,
    SummarytableModule,
    CountylistModule,
    OverlayModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([SidebarControlsState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [GlobalsService, GeojsonDataService],
  bootstrap: [AppComponent],
  exports: [SummarytableModule, CountylistModule, MatInputModule]
})
export class AppModule { }
