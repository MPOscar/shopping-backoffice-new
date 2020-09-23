import { Component, Inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

//import { setTranslations } from '@c/ngx-translate';
import { TRANSLATIONS } from './i18n/confirm-dialog.component.translations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../models/confirm-dialog-data';

@Component({
  selector: 'confirm-dialog-message',
  templateUrl: './confirm-dialog-message.component.html',
  styleUrls: ['./confirm-dialog-message.component.css']
})

export class ConfirmDialogMessageComponent {

  public titleKey = 'Title';

  public messageKey = 'Message';

  public messageParam: any = {};

  public okBtnKey = 'Accept';

  public cancelBtnKey = 'Cancel';

  confirmDelete = new FormControl();

  constructor(private translate: TranslateService, public dialogRef: MatDialogRef<ConfirmDialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  accept(): void {
    if (this.confirmDelete.value === "YES") {
      this.dialogRef.close(true);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
