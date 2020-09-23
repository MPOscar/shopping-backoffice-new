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
import { MatRadioModule  } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
//
import { ImageCardComponent } from './components/image-card/image-card.component';
import { ImageCardEditActionDirective } from './directives/images-card-edit-actions.directive';
import { ImageLoadDirective } from './directives/image-load.directive';
import { DropFilesDirective } from './directives/drop-files.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatRadioModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule
  ],
  declarations: [
    DropFilesDirective,
    ImageCardComponent,
    ImageCardEditActionDirective,
    ImageLoadDirective
  ],
  exports: [
    DropFilesDirective,
    ImageCardComponent,
    ImageCardEditActionDirective,
    ImageLoadDirective
  ]
})
export class ImageCardModule { }
