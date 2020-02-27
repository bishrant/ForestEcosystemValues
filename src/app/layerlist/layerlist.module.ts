import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerlistComponent } from './layerlist.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AllMaterialModule } from '../material.module';

@NgModule({
  declarations: [LayerlistComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    AllMaterialModule
  ],
  exports:[LayerlistComponent]
})
export class LayerlistModule { }
