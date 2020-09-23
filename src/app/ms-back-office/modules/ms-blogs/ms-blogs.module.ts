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
import { AngularEditorModule } from '@kolkov/angular-editor';
//
import { ImageCardModule } from '../../../ui/modules/image-card/image-card.module';
import { ImagesCardModule } from '../../../ui/modules/images-card/images-card.module';
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
//
import { BlogFormComponent } from './components/blog-form/blog-form.component';
import { SeeBlogComponent } from './components/see-blog/see-blog.component';
import { BlogsTableComponent } from './components/blogs-table/blogs-table.component';
import { DeleteBlogComponent } from './components/delete-blog/delete-blog.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { MsBlogsRoutingModule } from './ms-blogs-routing.module';
import { NewBlogComponent } from './components/new-blog/new-blog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
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
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule,
    MsBlogsRoutingModule,
    AskBeforeRefreshModule,
    ImageCardModule,
    ImagesCardModule,
    ErrorMessagesModule
  ],
  declarations: [
    BlogFormComponent,
    BlogsTableComponent,
    DeleteBlogComponent,
    EditBlogComponent,
    NewBlogComponent,
    SeeBlogComponent
  ],
  exports: [
    BlogFormComponent,
    BlogsTableComponent,
    DeleteBlogComponent,
    EditBlogComponent,
    NewBlogComponent,
  ],
  entryComponents: [
    SeeBlogComponent
  ]
})
export class MsBlogsModule { }
