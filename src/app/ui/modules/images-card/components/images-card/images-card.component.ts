import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild  } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from '../../../../../error-handling/services/toastr.service';

import { DropFilesDirective } from '../../directives/drop-files.directive';
import { Face, State, Status } from '../../models/face';
import { ConfirmDialogComponent } from '../../../confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { DragulaService } from 'ng2-dragula';

const imageSizeErrorMessageKey = 'Image Size Error Message';
const imageTypeErrorMessageKey = 'Image Type Error Message';

@Component({
  selector: 'images-card',
  templateUrl: './images-card.component.html',
  styleUrls: ['./images-card.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImagesCardComponent), multi: true }
  ]
})
export class ImagesCardComponent implements OnInit, ControlValueAccessor {

  // modalRef: MatDialogRef<AnnotationToolModalComponent | ConfirmDialogComponent>;

  @Input() caseId: string;

  @Input() disabled = false;

  @Input() trackByKey: string;

  @Input() imageWidth = 100;

  @Input() imageHeight = 100;

  @Input() principal: Face;

  @ViewChild(DropFilesDirective) dropFilesDirective: DropFilesDirective;

  private _faceItems: Array<Face> = [];

  fileIsOver = false;

  // @Input() imageCardEditAction: ImageCardEditActionDirective;

  @Output() deletedFace = new EventEmitter<Face>();

  propagateChange = (_: Array<Face>) => {};

  constructor(
    private dragulaService: DragulaService,
    private toastr: ToastrService,
  ) {
    // setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.dragulaService.dropModel('faceItems')
      .subscribe(({ targetModel }) => {
        this.faceItems = targetModel;
      });
  }

  get faceItems(): Array<Face> {
    return this._faceItems;
  }

  set faceItems(value: Array<Face>) {
    this._faceItems = value;
    this.propagateChange(this._faceItems);
  }

  writeValue(value: Array<Face>) {
    if (value !== undefined && value !== null && value.length > 0) {
      this._faceItems = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

  private validateImage(image: File): boolean {
    let result = true;
    if (image && image.size > 0 && image.size > 20971520) {
      result = false;
      this.toastr.error(imageSizeErrorMessageKey);
    } else {
      if (!(image.type === 'image/jpeg' || image.type === 'image/jpg' || image.type === 'image/jp2' || image.type === 'image/tiff' || image.type === 'image/png' || image.type === 'image/pgm' || image.type === 'image/bmp')) {
        result = false;
        this.toastr.error(imageTypeErrorMessageKey);
      }
    }
    return result;
  }

  /*addImages($event) {
    if ($event.target.files && $event.target.files.length > 0) {
      for (const file of $event.target.files) {
        if (this.validateImage(file)) {
          const newFace: Face = {
            file: file,
            state: State.New,
            status: Status.Pending,
            mainImage: false
          };
          if (this.faceItems) {
            this.faceItems = [...this.faceItems, newFace];
          } else {
            this.faceItems = [newFace];
          }
        }
      }
      $event.target.value = '';
    }
  }*/

  checkUploadStatusUploading(status: Status) {
    return status === Status.Uploading;
  }

  checkUploadStatusUploaded(status: Status) {
    return status === undefined || status === Status.Uploaded;
  }

  checkUploadStatusError(status: Status) {
    return status === Status.Error;
  }

  checkUploadStatusPending(status: Status) {
    return status === Status.Pending;
  }

  trackByFn(index: number, data: Face) {
    if (this.trackByKey) {
      return data[this.trackByKey] ? data[this.trackByKey] : data['id'];
    }
    return data['id'];
  }

  deleteFace(index: any) {
    const deletedItem = this.faceItems.splice(index, 1).pop();
    if (deletedItem.mainImage) {
      this.principal = null;
    }
    this.faceItems = [...this.faceItems];
    this.deletedFace.emit(deletedItem);
  }

  fileOverDropZone(event: any) {
    this.fileIsOver = event;
  }

  filesChange(event: any) {
    // add id for tracking even after drag-drop reordering
    this.faceItems = event.map((i, idx) => ({ ...i, id: idx }));
  }

  setMainImage(faceItem: Face) {
    this.principal = faceItem;
    faceItem.mainImage = true;
    this.faceItems.forEach(image => {
      image.mainImage = false;
    });
    faceItem.mainImage = true;
  }
}
