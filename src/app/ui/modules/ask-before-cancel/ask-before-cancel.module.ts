import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskBeforeCancelDirective } from './directives/ask-before-cancel.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        AskBeforeCancelDirective
    ],
    exports: [
        AskBeforeCancelDirective
    ],
})
export class AskBeforeCancelModule {}
