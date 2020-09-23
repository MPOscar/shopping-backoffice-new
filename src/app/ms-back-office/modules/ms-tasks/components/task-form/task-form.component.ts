import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Task } from '../../models/tasks';
import { User } from "../../../ms-users/models/users";
import { Priority, PRIORITY } from '../../models/priority';

@Component({
    selector: 'task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskFormComponent extends BaseReactiveFormComponent<Task> implements OnInit {


    @Input() users: Array<User>;

    priorities: Priority[] = PRIORITY;
    
    constructor(translateService: TranslateService) {
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
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            description: new FormControl(this.data.description, [Validators.required]),
            responsable: new FormControl(this.data.responsable, [Validators.required]),
            priority: new FormControl(this.data.priority, [Validators.required]),
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }
}

