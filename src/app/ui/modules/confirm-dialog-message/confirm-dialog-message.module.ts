import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
//
import { ConfirmDialogMessageComponent } from './components/confirm-dialog-message/confirm-dialog-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ConfirmDialogMessageComponent
  ],
  exports: [
    ConfirmDialogMessageComponent
  ]
})
export class ConfirmDialogMessageModule {
}
