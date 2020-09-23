import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Link } from '../../models/urls';
import { Shop } from '../../../ms-shops/models/shops';

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

        if (this.data.id || this.data.linkText) {
            this.text = this.data.linkText;
            this.url = this.data.linkUrl;
        } else {
            this.text = this.shop.defaultOfferLabel ? this.shop.defaultOfferLabel : 'Get it';
            this.url = '';
        }

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();
    }

    createFormGroup() {
        const urlRegexp = '(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?';
        this.formGroup = new FormGroup({
            linkUrl: new FormControl(this.url, [Validators.pattern(urlRegexp)]),
            linkText: new FormControl(this.text)
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

