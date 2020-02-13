import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummarytableComponent } from './summarytable.component';
import { DetailtableModule } from '../detailtable/detailtable.module';
import { AllMaterialModule } from '../material.module';


@NgModule({
  declarations: [SummarytableComponent],
  imports: [
    CommonModule,
    DetailtableModule,
    AllMaterialModule,
  ],
  exports: [SummarytableComponent]
})
export class SummarytableModule { }
