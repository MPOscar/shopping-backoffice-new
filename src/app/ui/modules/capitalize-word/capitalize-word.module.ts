import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { CapitalizeWordPipe } from './pipes/capitalize-word.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CapitalizeWordPipe
  ],
  exports: [
    CapitalizeWordPipe
  ],
  providers: [
    CapitalizeWordPipe
  ]
})
export class CapitalizeWordModule {}
