import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { StoreModule } from '@ngrx/store';
import { RootActionsService } from './services/root-actions.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule
  ],
  declarations: [],
  exports: [],
  providers: [
    RootActionsService
  ]
})
export class NgrxModule { }
