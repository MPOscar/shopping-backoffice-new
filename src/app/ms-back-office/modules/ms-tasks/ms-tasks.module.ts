import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
//
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
//
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TasksTableComponent } from './components/tasks-table/tasks-table.component';
import { DeleteTaskComponent } from './components/delete-task/delete-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { MsTasksRoutingModule } from './ms-tasks-routing.module';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { PendingTasksTableComponent } from './components/pending-tasks-table/pending-tasks-table.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule,
    MsTasksRoutingModule,
    AskBeforeRefreshModule,
    ErrorMessagesModule
  ],
  declarations: [
    TaskFormComponent,
    TasksTableComponent,
    DeleteTaskComponent,
    EditTaskComponent,
    NewTaskComponent,
    PendingTasksTableComponent
  ],
  exports: [
    TaskFormComponent,
    TasksTableComponent,
    DeleteTaskComponent,
    EditTaskComponent,
    NewTaskComponent,
    PendingTasksTableComponent
  ],
  entryComponents: [
    NewTaskComponent,
    EditTaskComponent,
  ]
})
export class MsTasksModule { }
