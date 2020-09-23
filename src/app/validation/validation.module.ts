import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UppercaseValidationDirective } from './directives/uppercase-validation-directive';
import { LowercaseValidationDirective } from './directives/lowercase-validation-directive';
import { DigitsCountValidationDirective } from './directives/digits-count-validation-directive';
import { SpecialCharsCountDirective } from './directives/special-chars-count-validation-directive';
import { PhoneNumberValidationDirective } from './directives/phone-number-validation-directive';
import { SamePasswordValidationDirective } from './directives/same-password-validation-directive';
import { RequiredIfFieldHasValueValidationDirective } from './directives/required-if-field-has-value.directive';
import { NumberDirective } from './directives/number.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UppercaseValidationDirective,
    LowercaseValidationDirective,
    DigitsCountValidationDirective,
    SpecialCharsCountDirective,
    PhoneNumberValidationDirective,
    SamePasswordValidationDirective,
    RequiredIfFieldHasValueValidationDirective,
    NumberDirective
  ],
  exports: [
    UppercaseValidationDirective,
    LowercaseValidationDirective,
    DigitsCountValidationDirective,
    SpecialCharsCountDirective,
    PhoneNumberValidationDirective,
    SamePasswordValidationDirective,
    RequiredIfFieldHasValueValidationDirective,
    NumberDirective
  ]
})
export class ValidationModule { }
