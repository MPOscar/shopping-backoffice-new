import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { DeepLinkGeneratorService } from '../../services/deep-link-generator.service';
import { HomeService } from '../../services/home.service';
import { DeepLink } from '../../models/deep-link';
import { Shop } from '../../../ms-shops/models/shops';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';

//
import { EditContactDetailComponent } from '../../../ms-contact-detail/components/edit-contact-detail/edit-contact-detail.component';
import { EditPrivacyComponent } from '../../../ms-privacy/components/edit-privacy/edit-privacy.component';
import { EditGDPRComponent } from '../../../ms-gdpr/components/edit-gdpr/edit-gdpr.component';
import { EditSocialNetworksComponent } from '../../../ms-social-networks/components/edit-social-networks/edit-social-networks.component';
import { EditBecomePartnerComponent } from '../../../ms-become-partner/components/edit-become-partner/edit-become-partner.component';
import { EditWhoAreWeComponent } from '../../../ms-who-are-we/components/edit-who-are-we/edit-who-are-we.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent extends BaseReactiveFormComponent<DeepLink> implements OnInit {

    formGroup: FormGroup;

    modalRef: MatDialogRef<EditContactDetailComponent | EditPrivacyComponent | EditGDPRComponent
                        | EditSocialNetworksComponent | EditBecomePartnerComponent | EditWhoAreWeComponent>;

    shops: Array<Shop>;

    totalNumberOfClicks: number;

    constructor(public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public deepLinkGeneratorService: DeepLinkGeneratorService,
        public homeService: HomeService,
        translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.homeService.getNumberOfClicks('offerTrakedLink').subscribe(response => {
            this.totalNumberOfClicks = response.data.total;
        })
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];
        this.validationErrorMessages = validationsErrors;
        this.data = {
            shopId: '',
            simplifiedUrl: '',
            url: ''
        }
        this.createFormGroup()
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            url: new FormControl('', [Validators.required]),
            shopId: new FormControl('', [Validators.required]),
            simplifiedUrl: new FormControl({ value: "", disabled: true }),
        });

    }

    editContactDetailModal() {
        this.modalRef = this.dialog.open(EditContactDetailComponent, {
            data: {
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
        });
    }

    editPrivacyModal() {
        this.modalRef = this.dialog.open(EditPrivacyComponent, {
            height: '90%',
            data: {
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
        });
    }

    editGDPRModal() {
        this.modalRef = this.dialog.open(EditGDPRComponent, {
            height: '90%',
            data: {
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
        });
    }

    editBecomePartnerModal() {
        this.modalRef = this.dialog.open(EditBecomePartnerComponent, {
            height: '90%',
            data: {
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
        });
    }

    editWhoAreWeModal() {
        this.modalRef = this.dialog.open(EditWhoAreWeComponent , {
            height: '90%',
            data: {
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
        });
    }

    EditSocialNetworksModal() {
        this.modalRef = this.dialog.open(EditSocialNetworksComponent, {
            data: {
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
        });
    }


    generateDeepLink() {
    }

    submitClicked() {
        if (this.formGroup.valid) {
            const trackingListBaseUrl = this.shops.find(item => {
                return item.id === this.formGroup.get('shopId').value;
            }).trackingListBaseUrl;
            const data = {
                trackingUrl: trackingListBaseUrl,
                url: this.formGroup.get('url').value,
            }
            this.deepLinkGeneratorService.postDeepLinkGenerator(data).subscribe(response => {
                this.formGroup.get('simplifiedUrl').setValue(response.data.deeplink.url);
            })
        }
    }

}
