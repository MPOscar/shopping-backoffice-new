import { Component, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Deal } from '../../models/deal';
import { DealsService } from '../../services/deals.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { NewDealComponent } from '../new-deal/new-deal.component';
import { Brand } from '../../../ms-brands/models/brand';


const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
  selector: 'deal-creator',
  templateUrl: './deal-creator.component.html',
  styleUrls: ['./deal-creator.component.scss']
})
@Mixin([CanDeactivateMixin])
export class DealCreatorComponent implements CanDeactivateMixin, OnInit {

  data: Deal = {
    id: '',
  };

  deals: Array<Deal>;

  brands: Array<Brand>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  //modalRef: MatDialogRef<ConfirmDialogComponent>;

  modalRef: MatDialogRef<NewDealComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;


  validationErrors: ValidationErrors;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dealsService: DealsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.deals = this.activatedRoute.snapshot.data.Deals;
  }

  submit(data: Deal) {
    this.createUser(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }

  createUser(data: Deal) {

    this.dealsService.postDeal(data).subscribe(response => {
      this.unsavedChanges = false;
      //this.close.emit();TODO
      this.close();
      this.toastr.success(savedMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }

  showModal() {
    this.modalRef = this.dialog.open(NewDealComponent, {
      height: '90%',
      width: '90%',
      data: { Deals: this.deals }
    });
  }

  linkShopsModalDeal() {
    /*his.modalRef = this.dialog.open(LinkShopsModalComponent, {
      height: '90%',
      width: '90%',
      data: { data: this.data }
    });*/
  }

  linkShopsModalBrand() {

  }
}
