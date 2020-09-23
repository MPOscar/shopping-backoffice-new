import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { environment } from '../../../../../../environments/environment.prod';
//
import { Blog } from '../../models/blog';
import { BlogsImgesService } from '../../services/blogs-images.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';

const errorKey = 'Error';

@Component({
    selector: 'blog-form',
    templateUrl: './blog-form.component.html',
    styleUrls: ['./blog-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BlogFormComponent extends BaseReactiveFormComponent<Blog> implements OnInit {

    AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        uploadUrl: environment.apiUrl + 'image/editor/', // if needed
        customClasses: [ // optional
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ]
    };

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    @Input() brands: Array<Brand>;

    constructor(
        public blogsImgesService: BlogsImgesService,
        private formBuilder: FormBuilder,
        public errorHandlingService: ErrorHandlingService,
        translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();
    }

    createFormGroup() {
        this.faces = this.formBuilder.control(this.faceList);
        this.formGroup = new FormGroup({
            author: new FormControl(this.data.author, [Validators.required]),
            brandId: new FormControl(this.data.brandId, [Validators.required]),
            body: new FormControl(this.data.body, [Validators.required]),
            faces: this.faces,
            title: new FormControl(this.data.title, [Validators.required]),
            type: new FormControl(this.data.type, [Validators.required]),
        });
    }

    onDeleteFace(face: Face) {
        if (face.id) {
            this.blogsImgesService.deleteBlogImage(this.data.id, face.id).subscribe(response => {
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));

        }
    }

    submitClicked() {
        this.data.faces = this.data.faces.map((f, idx) => ({ ...f, position: idx }));
        if (this.data.faces.length === 1) {
            this.data.faces[0].mainImage = true;
        }
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }
}

