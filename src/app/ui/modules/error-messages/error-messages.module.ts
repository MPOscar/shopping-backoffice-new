import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
//
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { CapitalizeWordModule } from '../capitalize-word/capitalize-word.module';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        CapitalizeWordModule
    ],
    declarations: [
        ErrorMessagesComponent
    ],
    exports: [
        ErrorMessagesComponent
    ]
})
export class ErrorMessagesModule {}
