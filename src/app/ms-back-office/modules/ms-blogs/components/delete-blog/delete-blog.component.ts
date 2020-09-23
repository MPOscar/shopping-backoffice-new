import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';


//import { setTranslations } from '../../../../../ngx-translate';
//import { TRANSLATIONS } from './i18n/delete-user.component.translations';
import { Blog } from '../../models/blog';
import { BlogsService } from '../../services/blogs.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Blog?';

const errorKey = 'Error';

const deletedBlogMessageKey = 'Deleted';

@Component({
  selector: 'delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.scss']
})
export class DeleteBlogComponent implements AfterViewInit, OnInit {

  blogId: string;

  data: Blog;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public blogsService: BlogsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getBlog();
  }

  ngOnInit() {
    this.blogId = this.activatedRoute.snapshot.data.blogId;
  }

  getBlog() {
    this.blogsService.getBlog(this.blogId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteBlog();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteBlog() {
    this.modalRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titleKey: titleKey,
        okBtnKey: deleteBtnKey,
        messageKey: messageKey,
        messageParam: { param: this.data }
      }
    });

    this.modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteBlog();
      } else {
        this.close();
      }
    });
  }

  deleteBlog(): void {
    this.blogsService.deleteBlog(this.data.id).subscribe(response => {
      this.blogsService.reloadBlogs().subscribe(response => {
        this.blogsService.blogsList.next(response);
        this.toastr.success(deletedBlogMessageKey);
        this.close();
      },
        (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.close();
      }
    )
  }
}


