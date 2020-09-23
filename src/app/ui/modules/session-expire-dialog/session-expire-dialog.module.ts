import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { TranslateModule } from '@ngx-translate/core';
//
import { SessionExpireDialogComponent } from './components/session-expire-dialog/session-expire-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        TranslateModule.forChild()
    ],
    declarations: [
        SessionExpireDialogComponent
    ],
    exports: [
        SessionExpireDialogComponent
    ]
})
export class SessionExpireDialogModule {}
