import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { ReleaseImage } from '../../../../../ms-back-office/modules/ms-releases/models/releases';
import { DropFilesDirective } from '../../directives/drop-files.directive';
import { Face, State, Status } from '../../models/face';
import { ConfirmDialogComponent } from '../../../confirm-dialog/components/confirm-dialog/confirm-dialog.component';


const imageSizeErrorMessageKey = 'Image Size Error';
const imageTypeErrorMessageKey = 'Image Type Error';

@Component({
  selector: 'image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageCardComponent), multi: true }
  ]
})
export class ImageCardComponent implements OnInit, ControlValueAccessor {

  // modalRef: MatDialogRef<AnnotationToolModalComponent | ConfirmDialogComponent>;

  @Input() caseId: string;

  @Input() disabled: boolean = false;

  @Input() trackByKey: string;

  @Input() imageWidth = 100;

  @Input() imageHeight = 100;

  @Input() principal: Face;

  @ViewChild(DropFilesDirective) dropFilesDirective: DropFilesDirective;

  private _faceItems: Array<Face> = [];

  fileIsOver: boolean = false;

  // @Input() imageCardEditAction: ImageCardEditActionDirective;

  @Output() deletedFace = new EventEmitter<Face>();

  propagateChange = (_: Array<Face>) => {
  };

  constructor(private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
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
    }
    else {
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
      return data[this.trackByKey] ? data[this.trackByKey] : index;
    }
    return index;
  }

  deleteFace(index: any) {
    const deletedItem = this.faceItems.splice(index, 1).pop();
    this.faceItems = [...this.faceItems];
    this.deletedFace.emit(deletedItem);
  }

  fileOverDropZone(event: any) {
    this.fileIsOver = event;
  }

  filesChange(event: any) {
    this.faceItems = event;
    this.principal = this.faceItems[0];
  }

  setMainImage(faceItem: Face) {
    this.principal = faceItem;
    faceItem.mainImage = true;
    this.faceItems.forEach(image => {
      image.mainImage = false;
    });
    faceItem.mainImage = true;
  }

  initialize(faceItem?: Face) {
    if (faceItem) {
      this.principal = faceItem;
      this.faceItems.push(faceItem);
    } else {
      this.principal = null;
      this.faceItems = [];
    }
  }
}
