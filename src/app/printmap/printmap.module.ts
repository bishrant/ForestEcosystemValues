import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintmapComponent } from './printmap.component';
import { AllMaterialModule } from '../material.module';

@NgModule({
  declarations: [PrintmapComponent],
  imports: [
    CommonModule,
    AllMaterialModule
  ],
  exports: [PrintmapComponent]
})
export class PrintmapModule { }
