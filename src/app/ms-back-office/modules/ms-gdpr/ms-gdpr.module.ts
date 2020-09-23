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
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
//
import { GDPRFormComponent } from './components/gdpr-form/gdpr-form.component';
import { EditGDPRComponent } from './components/edit-gdpr/edit-gdpr.component';

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
    AskBeforeRefreshModule,
    ImageCardModule,
  ],
  declarations: [
    GDPRFormComponent,
    EditGDPRComponent,
  ],
  exports: [
    GDPRFormComponent,
    EditGDPRComponent,
  ],
  entryComponents: [
    EditGDPRComponent,
  ]
})
export class MsGDPRModule { }
