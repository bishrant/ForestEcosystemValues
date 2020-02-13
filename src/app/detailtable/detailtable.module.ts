import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { DetailtableComponent } from './detailtable.component';


@NgModule({
  declarations: [DetailtableComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [DetailtableComponent]
})
export class DetailtableModule { }
