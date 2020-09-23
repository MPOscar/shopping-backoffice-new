import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatRadioModule  } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
//
import { ImageLoadDirective } from './directives/image-load.directive';
import { DropFilesDirective } from './directives/drop-files.directive';
import { ImageCardEditActionDirective } from './directives/images-card-edit-actions.directive';
import { ImagesLayoutCardComponent } from './components/images-layout-card/images-layout-card.component';

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
    ImageCardEditActionDirective,
    ImageLoadDirective,
    ImagesLayoutCardComponent
  ],
  exports: [
    DropFilesDirective,
    ImageCardEditActionDirective,
    ImageLoadDirective,
    ImagesLayoutCardComponent
  ]
})
export class ImagesLayoutCardModule { }
