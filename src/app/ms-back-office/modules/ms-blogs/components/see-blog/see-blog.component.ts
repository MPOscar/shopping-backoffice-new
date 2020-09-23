import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Blog } from '../../models/blog';
import { BlogsService } from '../../services/blogs.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';

const errorKey = 'Error';

@Component({
    selector: 'see-blog',
    templateUrl: './see-blog.component.html',
    styleUrls: ['./see-blog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SeeBlogComponent extends BaseReactiveFormComponent<Blog> implements OnInit {

    AngularEditorConfig = {
        editable: false,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        uploadUrl: '', // if needed
        customClasses: [ // optional
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ],
        toolbarPosition: 'none',
    };

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    @Input() brands: Array<Brand>;

    constructor(
        private formBuilder: FormBuilder,
        public blogsService: BlogsService,
        private errorHandlingService: ErrorHandlingService,
        translateService: TranslateService,
        public dialogRef: MatDialogRef<SeeBlogComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        let validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();

        this.blogsService.getBlog(this.dialogData.id).subscribe(response => {
            this.data = response.data;
            if (this.data.imgUrl) {
              let face: Face = {
                imgUrl: this.data.imgUrl,
              };
              this.faceList = [face];
              this.principal = face;
            }

          },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
          )

    }

    createFormGroup() {
        this.faces = this.formBuilder.control(this.dialogData.faceList);
        this.formGroup = new FormGroup({
            author: new FormControl(this.dialogData.data.author),
            brandId: new FormControl(this.dialogData.data.brandId),
            body: new FormControl(this.dialogData.data.body),
            faces: this.faces,
            title: new FormControl(this.dialogData.data.title),
            type: new FormControl(this.dialogData.data.type),
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    close() {
        this.dialogRef.close();
    }
}

