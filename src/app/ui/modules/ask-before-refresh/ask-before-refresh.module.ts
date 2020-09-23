import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskBeforeRefreshDirective } from './directives/ask-before-refresh.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        AskBeforeRefreshDirective
    ],
    exports: [
        AskBeforeRefreshDirective
    ],
})
export class AskBeforeRefreshModule {}
