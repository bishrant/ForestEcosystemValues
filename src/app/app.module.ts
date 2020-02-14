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
    AllMaterialModule,
    SummarytableModule,
    OverlayModule,
    DragDropModule,
    NgxsModule.forRoot([SidebarControlsState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [SummarytableModule]
})
export class AppModule { }
