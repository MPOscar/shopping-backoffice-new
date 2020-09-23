import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input, OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  calculateAspectRatio,
  imageBestFit
} from '../helpers/image-proportions-helper';
import { Size } from '../models/image-properties';

@Directive({
  selector: 'img[imageLoad]'
})
export class ImageLoadDirective implements AfterViewInit, OnInit, OnChanges {
  _loadImage: HTMLImageElement;

  imageAspectRatio: number;

  imageBestFit: Size = {height: null, width: null};

  @Input() container: HTMLElement;

  @Input() srcImage: File | string;

  constructor(private hostElement: ElementRef) {

  }

  ngOnInit() {
    if (this.srcImage === undefined) {
      throw new Error('Please you need to provide a valid image, file or url');
    }

    if (this.container && this.container instanceof ElementRef) {
      this.container = this.container.nativeElement;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initializeImage();
  }

  get loadImage(): HTMLImageElement {
    if (this._loadImage === null || this._loadImage === undefined) {
      this._loadImage = this.hostElement.nativeElement;
    }
    return this._loadImage;
  }

  set loadImage(value: HTMLImageElement) {
    this._loadImage = value;
  }

  ngAfterViewInit() {
    this.initializeImage();
  }

  initializeImage() {
    this.loadImage.onload = () => {
      this.imageAspectRatio = calculateAspectRatio(this.loadImage.naturalHeight, this.loadImage.naturalWidth);
      this.imageBestFit = imageBestFit(this.loadImage, this.container, this.imageAspectRatio);
      this.hostElement.nativeElement.width = this.imageBestFit.width;
      this.hostElement.nativeElement.height = this.imageBestFit.height;
    };
    // Checking if the thumbnail is provided by a file or by a string in base 64
    if (typeof this.srcImage === 'string') {
      this.loadImage.src = this.srcImage;
    } else if (!!this.srcImage) {      
      const reader = new FileReader();
      reader.onloadend = () => {
        this.loadImage.src = reader.result as string;
      };
      reader.readAsDataURL(this.srcImage);
    }

  }

  private imageIsBiggestThanAvailableSpace(): boolean {
    if (this.loadImage.naturalHeight > this.container.clientHeight && this.loadImage.naturalWidth > this.container.clientWidth) {
      return true;
    }
    return false;
  }
}
