import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, AppDialogComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EsrimapComponent } from './esrimap/esrimap.component';
import { AllMaterialModule } from './material.module';
import { SummarytableModule } from './summarytable/summarytable.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { SidebarControlsState } from './shared/sidebarControls.state';
import { environment } from 'src/environments/environment';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GlobalsService } from './services/globals.service';
import { GeojsonDataService } from './services/geojson-data.service';
import { CountylistModule } from './sidebar/countylist/countylist.module';
import { LayerlistModule } from './layerlist/layerlist.module';
import { LegendModule } from './legend/legend.module';
import { PrintmapModule } from './printmap/printmap.module';

@NgModule({
  declarations: [
    AppComponent,
    AppDialogComponent,
    SidebarComponent,
    EsrimapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScrollingModule,
    AllMaterialModule,
    SummarytableModule,
    CountylistModule,
    LegendModule,
    LayerlistModule,
    PrintmapModule,
    NgxsModule.forRoot([SidebarControlsState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [GlobalsService, GeojsonDataService],
  bootstrap: [AppComponent],
  exports: [SummarytableModule, CountylistModule, LayerlistModule, LegendModule, PrintmapModule],
  entryComponents: [AppDialogComponent]
})
export class AppModule { }
