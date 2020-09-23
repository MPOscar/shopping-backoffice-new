import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output

} from '@angular/core';

import { Face, State, Status } from '../models/face';
import { ToastrService } from '../../../../error-handling/services/toastr.service';

const imageSizeErrorMessageKey = 'Image Size Error';
const imageTypeErrorMessageKey = 'Image Type Error';

@Directive({
  selector: '[drop-files]'
})
export class DropFilesDirective {

  @Input() faceItems: Face[] = [];
  @Output() filesOver: EventEmitter<any> = new EventEmitter();
  @Output() filesChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private hostElement: ElementRef,
    private toastr: ToastrService
  ) {

  }

  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: any) {
    this.filesOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.filesOver.emit(false);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: any) {
    let transfer = this.getTarnsfer(event);
    transfer.dropEffect = 'copy';
    this.preventAndStop(event);
    this.filesOver.emit(true);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    this.preventAndStop(event);
    let transfer = this.getTarnsfer(event);
    if (!transfer) {
      return;
    }
    this.addFiles(transfer.files);
    this.filesOver.emit(false);
  }

  @HostListener('change', ['$event.target.files'])
  public onChangeFileInput(event: any) {
    this.addFiles(event);
  }

  private getTarnsfer(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private preventAndStop(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  private addFiles(fileList: FileList) {
    for (let property in Object.getOwnPropertyNames(fileList)) {
      let tempFile = fileList[property];
      if (this.fileCanBeLoad(tempFile)) {
        let newFile = new Face(tempFile);
        this.faceItems = [...this.faceItems, newFile];
      }
    }
    this.filesChange.emit(this.faceItems);
  }

  private fileIsInFiles(fileName: string) {

    for (let i in this.faceItems) {
      let file = this.faceItems[i];
      if (file.state === State.New) {
        if (file.file.name === fileName) {
          return false
        }
      }
    }
    return true;
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

  private fileCanBeLoad(file: File) {

    if (this.fileIsInFiles(file.name) && this.validateImage(file)) {
      return true;
    }
    return false;
  }

  addImages($event) {
    if ($event.target.files && $event.target.files.length > 0) {
      for (const file of $event.target.files) {
        if (this.validateImage(file)) {
          const newFace: Face = {
            file: file,
            state: State.New,
            status: Status.Pending,
            mainImage: false
          };
          this.faceItems = [...this.faceItems, newFace];
        }
      }
      $event.target.value = '';
    }
  }

}
