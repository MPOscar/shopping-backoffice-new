import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { CapsLockDirective } from './directives/caps-lock.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CapsLockDirective
  ],
  exports: [
    CapsLockDirective
  ]
})
export class CapsLockModule {}
