import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { SpinnerIndicator200Component } from './components/spinner-indicator-200/spinner-indicator-200.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SpinnerIndicator200Component
  ],
  exports: [
    SpinnerIndicator200Component
  ]
})
export class SpinnerIndicator200Module {}
