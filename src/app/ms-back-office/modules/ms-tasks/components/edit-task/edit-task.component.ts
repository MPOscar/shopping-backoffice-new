import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Task } from '../../models/tasks';
import { TasksService } from '../../services/tasks.service';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedMessageKey = 'Updated';

@Component({
  selector: 'edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditTaskComponent implements AfterViewInit, CanDeactivateMixin {

  data: Task;

  validationErrors: ValidationErrors;

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

  taskId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    public tasksService: TasksService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit(){
    this.taskId = this.dialogData.id;
  }
  ngAfterViewInit() {
    this.getTask();
  }

  getTask() {
    this.tasksService.getTask(this.taskId).subscribe(response => {
      this.data = response.data;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  submit(data: Task) {
    delete data.updatedAt;
    delete data.createdAt;
    this.updateStyle(data);
  }

  cancel() {
    this.close();
  }

  close(){
    this.dialogRef.close();
  }

  updateStyle(data: Task) {
    this.tasksService.putTask(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }
}
