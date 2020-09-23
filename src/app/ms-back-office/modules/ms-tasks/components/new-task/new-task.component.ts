import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Task } from '../../models/tasks';
import { TasksService } from '../../services/tasks.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
  selector: 'new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewTaskComponent implements CanDeactivateMixin {

  data: any = {
    name: "",
  };


  tasks: Array<Task>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  // end

  validationErrors: ValidationErrors;

  //@Input() brands: Array<Brand>;TODO

  //@Output() close = new EventEmitter();TODO

  constructor(
    public dialogRef: MatDialogRef<NewTaskComponent>,
    public activatedRoute: ActivatedRoute,
    public tasksService: TasksService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: Task
  ) {
  }

  submit(data: Task) {
    this.createUser(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  createUser(data: Task) {
    this.tasksService.postTask(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(savedMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'task');
        this.validationErrors = error.formErrors;
      });
  }
}
