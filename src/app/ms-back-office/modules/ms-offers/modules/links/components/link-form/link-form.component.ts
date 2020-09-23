import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Link } from '../../models/urls';
import { Shop } from 'src/app/ms-back-office/modules/ms-shops/models/shops';

@Component({
    selector: 'link-form',
    templateUrl: './link-form.component.html',
    styleUrls: ['./link-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LinkFormComponent extends BaseReactiveFormComponent<Link> implements OnInit {

    @Input() shop: Shop;

    text: string;

    url: string;

    trackedUrl: string;

    constructor(translateService: TranslateService) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        if (this.data.id) {
            this.text = this.data.text;
            this.url = this.data.url;
        } else {
            this.text = this.shop.defaultOfferLabel ? this.shop.defaultOfferLabel : 'Get it TEST';
            this.url = '';
        }

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();
    }

    createFormGroup() {

        this.formGroup = new FormGroup({
            url: new FormControl(this.url),
            text: new FormControl(this.text)
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }
}

