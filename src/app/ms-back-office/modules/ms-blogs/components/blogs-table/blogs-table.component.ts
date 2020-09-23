import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { BlogsService } from '../../services/blogs.service';
import { Blog, BlogsListResponse } from '../../models/blog';
import { Brand } from '../../../ms-brands/models/brand';
import { TYPE, Type } from '../../models/type';
import { SeeBlogComponent } from '../see-blog/see-blog.component';
import { Face } from '../../../../../ui/modules/images-card/models/face';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Blog?';

const errorKey = 'Error';

const deletedBlogMessageKey = 'Deleted';

@Component({
    selector: 'blogs-table',
    templateUrl: './blogs-table.component.html',
    styleUrls: ['./blogs-table.component.scss']
})
export class BlogsTableComponent implements OnInit, OnDestroy, AfterViewInit {

    displayedColumns: string[] = [
        'title',
        'thumbnail',
        'author',
        'type',
        'brandId',
        'updatedAt',
        'actions'
    ];

    blogs: Array<Blog> = [];

    brands: Array<Brand>;

    filter: FormGroup;

    modalRef: MatDialogRef<ConfirmDialogComponent | SeeBlogComponent>;

    totalLength = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    types: Type[] = TYPE;

    faceList: Array<Face> = [];

    principal: Face;

    blogId: string;

    data: any;

    subscriptions: Array<Subscription> = [];

    constructor(
        public activatedRoute: ActivatedRoute,
        public blogsService: BlogsService,
        private dialog: MatDialog,
        public errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {

        this.brands = this.activatedRoute.snapshot.data.brands;

        this.filter = this.createFilterFormGroup();
        const subfilterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.subscriptions.push(subfilterValueChanges);
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        const subBlogsList = this.blogsService.blogsList.subscribe((categoriesList: any) => {
            this.totalLength = categoriesList.dataCount;
            this.blogs = categoriesList.data;
            if (this.blogs.length === 0 && this.totalLength > 0 && this.blogsService.previousPageSize > 0) {
                this.blogsService.previousPageIndex =
                    Math.ceil(this.totalLength / this.blogsService.previousPageSize) - 1;
                const subReloadBlogs = this.blogsService.reloadBlogs().subscribe(response => {
                    this.blogsService.blogsList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
                this.subscriptions.push(subReloadBlogs);
            }
        });
        this.subscriptions.push(subBlogsList);
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    createFilterFormGroup() {
        const group: any = {};
        group['title'] = new FormControl('');
        group['author'] = new FormControl('');
        group['type'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        const subGetBlogs = this.blogsService.getBlogs(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: BlogsListResponse) => {
                this.blogsService.blogsList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err);
                });
        this.subscriptions.push(subGetBlogs);
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

    getBrand(id: string) {
        try {
            return this.brands.find(brand => {
                return brand.id === id;
            }).name;
        } catch (err) {
            return;
        }

    }

    confirmDeleteBlog(data: Blog) {
        this.modalRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                titleKey: titleKey,
                okBtnKey: deleteBtnKey,
                messageKey: messageKey,
                messageParam: { param: data }
            }
        });

        const subAfterClosed = this.modalRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteBlog(data);
            }
        });
        this.subscriptions.push(subAfterClosed);
    }

    deleteBlog(data: Blog): void {
        const subDeleteBlog = this.blogsService.deleteBlog(data.id).subscribe(response => {
            const subReloadBlogs = this.blogsService.reloadBlogs().subscribe(response => {
                this.blogsService.blogsList.next(response);
                this.toastr.success(deletedBlogMessageKey);
                this.loadPage();
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            this.subscriptions.push(subReloadBlogs);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            }
        );
        this.subscriptions.push(subDeleteBlog);
    }

    seeBlogModal(id: string) {

        const subGetBlog = this.blogsService.getBlog(id).subscribe(response => {
            this.data = response.data;
            if (this.data.imgUrl) {
                const face: Face = {
                    imgUrl: this.data.imgUrl,
                };
                this.faceList = [face];
                this.principal = face;
            }

            this.modalRef = this.dialog.open(SeeBlogComponent, {
                height: '90%',
                width: '95%',
                data: {
                    id: id,
                    faceList: this.faceList,
                    principal: this.principal,
                    data: response.data,
                    brands: this.brands
                }
            });

        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );
        this.subscriptions.push(subGetBlog);
    }

}

