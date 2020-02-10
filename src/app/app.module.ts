import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule} from '@angular/flex-layout';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import { EsrimapComponent } from './esrimap/esrimap.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AllMaterialModule } from './material.module';

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
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatFormFieldModule,  
    AllMaterialModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
