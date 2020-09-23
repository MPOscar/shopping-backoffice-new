import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { TranslateModule } from '@ngx-translate/core';
//
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    AlertDialogComponent
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class AlertDialogModule {
}
