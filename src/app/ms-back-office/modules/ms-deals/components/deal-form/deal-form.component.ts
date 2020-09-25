import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { Face } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Deal } from '../../models/deal';
import { Url } from '../../../ms-urls/models/urls';
import { Shop } from '../../../ms-shops/models/shops';
import { Status, STATUS } from '../../models/status';

@Component({
    selector: 'deal-form',
    templateUrl: './deal-form.component.html',
    styleUrls: ['./deal-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DealFormComponent extends BaseReactiveFormComponent<Deal> implements OnInit {

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    @Input() urls: Array<Url>;

    @Input() shopId: string;

    @Input() shops: Array<Shop>;

    faces: FormControl;

    status: Status[] = STATUS;

    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
      console.log(this.shops);
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();
    }

    createFormGroup() {
        this.faces = this.formBuilder.control(this.faceList);
        this.formGroup = new FormGroup({
            faces: this.faces,
            url: new FormControl(this.data.url, [Validators.required]),
            startDate: new FormControl(this.data.startDate),
            startTime: new FormControl(this.transformTimeTo12Format(this.data.startTime)),
            endDate: new FormControl(this.data.endDate),
            endTime: new FormControl(this.transformTimeTo12Format(this.data.endTime)),
            promoCode: new FormControl(this.data.promoCode),
            time: new FormControl(this.data.time),
            displayOnSale: new FormControl(this.data.displayOnSale),
            salePercentage: new FormControl(this.data.salePercentage),
            status: new FormControl(this.data.status),
            shopId: new FormControl(this.shopId ? this.shopId : this.data.shopId),
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            const entity = this.prepareEntity();
            this.accept.emit(entity);
        } else {
            this.triggerValidation();
        }

    }

    transformTimeTo24Format(time: string) {
        const timeFormat = /^([01]?\d):([0-5]\d)( (am|pm))?$/i;
        let hour = '00';
        let min = '00';
        if (time) {
            const match = time.match(timeFormat);
            if (match) {
                hour = match[1];
                min = match[2];
                const apm: string = match[4];
                if (apm === 'pm') {
                    let h = +hour;
                    h += 12;
                    hour = '' + h;
                } else if (hour === '12') {
                    hour = '00';
                }
            }
        }
        return `${hour}:${min}`;
    }

    transformTimeTo12Format(time: string) {
        if (time) {
            const timeFormat = /^([0-2]\d):([0-5]\d)$/;
            let hour = '00';
            let min = '00';
            let apm = 'am';
            const match = time.match(timeFormat);
            if (match) {
                hour = match[1];
                min = match[2];
                if (+hour > 12) {
                    let h = +hour;
                    h -= 12;
                    hour = '' + h;
                    apm = 'pm';
                }
            }
            return `${hour}:${min} ${apm}`;
        } else {
            return null;
        }
    }

    prepareEntity() {
        const data = { ...this.data };
        data.startTime = this.transformTimeTo24Format(this.formGroup.get('startTime').value);
        data.endTime = this.transformTimeTo24Format(this.formGroup.get('endTime').value);

        const shop = this.shops.find(s => s.id === this.formGroup.get('shopId').value);
        const url = this.formGroup.get('url').value;
        data.url = encodeURI(url);
        data.trackedUrl = (shop.trackingListBaseUrl ? shop.trackingListBaseUrl : '') + encodeURI(url);

        return data;
    }

    clearStartTime() {
        this.formGroup.get('startTime').setValue(null);
    }

    clearEndTime() {
        this.formGroup.get('endTime').setValue(null);
    }

}

