import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
//
import { merge, Subscription } from 'rxjs';
//
import { TranslatedValidationError } from '../../models/translated-validation-error';
import { CapitalizeWordPipe } from '../../../capitalize-word/pipes/capitalize-word.pipe';

@Component({
    selector: 'error-messages',
    templateUrl: 'error-messages.component.html',
    styleUrls: ['error-messages.component.css'],
})

export class ErrorMessagesComponent implements OnInit, OnDestroy {
    
    errorToDisplay = '';

    formControl: FormControl;

    formControlChanges: Subscription;

    _validationErrorMessages: TranslatedValidationError[];

    get validationErrorMessages(): TranslatedValidationError[] {
        return this._validationErrorMessages;
    }

    @Input() set validationErrorMessages(value: TranslatedValidationError[]) {
        this._validationErrorMessages = value;
        this.checkAndBuildErrorMessage();
    }

    @Input() displayError = true;

    @Input() for: string;

    @HostBinding('class')
    get hostClasses() {
        return [
            this.formControl.dirty ? 'ng-dirty' : '',
            this.formControl.invalid ? 'ng-invalid' : '',
            this.formControl.pristine ? 'ng-pristine' : '',
            this.formControl.touched ? 'ng-touched' : '',
            this.formControl.untouched ? 'ng-untouched' : '',
            this.formControl.valid ? 'ng-valid' : ''
        ].join(' ');
    }

    constructor(
        public controlContainer: ControlContainer,
        private capitalizeWordPipe: CapitalizeWordPipe) {
    }

    ngOnInit() {
        this.formControl = <FormControl>(this.controlContainer.control as FormGroup).get(this.for);
        this.formControlChanges = merge(this.formControl.valueChanges, this.formControl.statusChanges).subscribe(() => {
            this.checkAndBuildErrorMessage()
        });
        this.checkAndBuildErrorMessage();
    }

    ngOnDestroy() {
        if (this.formControlChanges) {
            this.formControlChanges.unsubscribe();
        }
    }

    checkAndBuildErrorMessage() {
      let errors = '';
      if (this.formControl) {
        if (this.formControl.errors && this.formControl.errors.message && this.formControl.errors.message !== '') {
          this.errorToDisplay = this.capitalizeWordPipe.transform(this.formControl.errors.message.constructor === Array ?
            this.formControl.errors.message.join(' ') : this.formControl.errors.message);
        } else {
          for (let key in Object.keys(this._validationErrorMessages)) {
            if (key ? (this.formControl.errors && this.formControl.errors[this._validationErrorMessages[key].type]) :
                (this.formControl.errors && this.formControl.errors[this._validationErrorMessages[key].type])) {
              errors = this.capitalizeWordPipe.transform(this._validationErrorMessages[key].translation);
              break;
            }
          }
          this.errorToDisplay = errors;
        }
      }
    }

}

