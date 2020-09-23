import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export class CanDeactivateMixin {

    saveTitleKey: string;

    saveMessageKey: string;

    cancelBtnKey: string;

    okBtnKey: string;

    unsavedChanges = false;

    modalRef: MatDialogRef<any>;

    constructor(public dialog: MatDialog) {}

    canDeactivate(): Observable<boolean> | boolean {
        if (this.unsavedChanges) {

            this.modalRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    titleKey: this.saveTitleKey,
                    messageKey: this.saveMessageKey,
                    okBtnKey: this.okBtnKey,
                    cancelBtnKey: this.cancelBtnKey,
                    okBtnColor: 'primary'
                }
            });

            return this.modalRef.afterClosed();

        } else {
            return true;
        }
    }

    dataChanged() {
        this.unsavedChanges = true;
    }
}
