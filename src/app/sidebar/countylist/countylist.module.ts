import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountylistComponent } from './countylist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AllMaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [CountylistComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    AllMaterialModule,
    ReactiveFormsModule,
  ], exports: [CountylistComponent]
})
export class CountylistModule { }
