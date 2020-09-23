import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
//
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { DeleteCategoryComponent } from './components/delete-category/delete-category.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { MsCategoriesRoutingModule } from './ms-categories-routing.module';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCardModule } from 'src/app/ui/modules/image-card/image-card.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MsCategoriesRoutingModule,
    AskBeforeRefreshModule,
    ErrorMessagesModule,
    ImageCardModule
  ],
  declarations: [
    CategoryFormComponent,
    CategoriesTableComponent,    
    DeleteCategoryComponent,    
    EditCategoryComponent,
    NewCategoryComponent    
  ],
  exports: [
    CategoryFormComponent,
    CategoriesTableComponent,    
    DeleteCategoryComponent,    
    EditCategoryComponent,
    NewCategoryComponent    
  ]
})
export class MsCategoriesModule { }
