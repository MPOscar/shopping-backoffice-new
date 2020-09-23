import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { TasksService } from "../../services/tasks.service";
import { Task, TasksListResponse } from "../../models/tasks";
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { NewTaskComponent } from '../new-task/new-task.component';
import { User } from "../../../ms-users/models/users";
import { PRIORITY, Priority } from '../../models/priority';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Task?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
    selector: 'tasks-table',
    templateUrl: './tasks-table.component.html',
    styleUrls: ['./tasks-table.component.scss']
})
export class TasksTableComponent implements OnInit {

    displayedColumns: string[] = [
        'description',
        'responsable',
        'priority',
        'actions'
    ];

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    tasksList: Subscription;

    tasks: Array<Task> = [];

    modalRef: MatDialogRef<ConfirmDialogComponent | EditTaskComponent | NewTaskComponent>;

    users: Array<User>;

    priorities: Priority[] = PRIORITY;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public errorHandlingService: ErrorHandlingService,
        public tasksService: TasksService,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        this.users = this.activatedRoute.snapshot.data.users;

        // Begin observing style list changes.
        this.tasksList = this.tasksService.tasksList.subscribe((TasksList: any) => {
            this.totalLength = TasksList.dataCount;
            this.tasks = TasksList.data;
            if (this.tasks.length === 0 && this.totalLength > 0 && this.tasksService.previousPageSize > 0) {
                this.tasksService.previousPageIndex =
                    Math.ceil(this.totalLength / this.tasksService.previousPageSize) - 1;
                this.tasksService.reloadTasks().subscribe(response => {
                    this.tasksService.tasksList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.tasksList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['description'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.tasksService.getTasks(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: TasksListResponse) => {
                this.tasksService.tasksList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err)
                });
    }

    onFilter() {
        this.paginator.pageIndex = 0;
        this.loadPage();
    }

    onSort() {
        this.paginator.pageIndex = 0;
        this.loadPage();
    }

    onPage() {
        this.loadPage();
    }

    addTaskModal() {
        this.modalRef = this.dialog.open(NewTaskComponent, {
            height: '60%',
            width: '500px',
            data: {
                priorities: this.priorities,
                users: this.users,
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    editTaskModal(id: string) {
        this.modalRef = this.dialog.open(EditTaskComponent, {
            height: '60%',
            width: '500px',
            data: {
                id: id,
                priorities: this.priorities,
                users: this.users,
            }
        });

        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    getUsers(id: string) {
        try {
            return this.users.find(user => {
                return user.id === id;
            }).firstName;
        }
        catch (err) {
            return;
        }
    }

    //delete
    getTaskToDelete(data: Task) {
        this.tasksService.getTask(data.id).subscribe(response => {
            data = response.data;
            this.confirmDeleteTask(data);
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        )
    }

    confirmDeleteTask(data: Task) {
        this.modalRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                titleKey: titleKey,
                okBtnKey: deleteBtnKey,
                messageKey: messageKey,
                messageParam: { param: data }
            }
        });

        this.modalRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteTask(data);
            }
        });
    }

    deleteTask(data: Task): void {
        this.tasksService.deleteTask(data.id).subscribe(response => {
            this.tasksService.reloadTasks().subscribe(response => {
                this.tasksService.tasksList.next(response);
                this.toastr.success(deletedMessageKey);
                this.loadPage();
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            }
        )
    }

}

