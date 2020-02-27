import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';

@NgModule({
  declarations: [LegendComponent],
  imports: [
    CommonModule
  ],
  exports: [LegendComponent]
})
export class LegendModule { }
