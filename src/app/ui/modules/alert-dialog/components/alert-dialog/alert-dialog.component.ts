import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@c/ngx-translate';
import { TRANSLATIONS } from './i18n/alert-dialog.component.translations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogData } from '../../models/alert-dialog-data';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})

export class AlertDialogComponent {

  public titleKey = '@c/ui/AlertDialogComponent/Title';

  public messageKey = '@c/ui/AlertDialogComponent/Message';

  public okBtnKey = '@c/ui/AlertDialogComponent/OK';

  public messageParam: any = {};

  constructor(private translate: TranslateService, public dialogRef: MatDialogRef<AlertDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AlertDialogData) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  accept(): void {
    this.dialogRef.close(true);
  }

}
