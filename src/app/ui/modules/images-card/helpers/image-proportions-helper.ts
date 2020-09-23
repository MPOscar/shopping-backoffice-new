import { Size } from '../models/image-properties';

export function calculateNewHeight(fixedWidth: number, aspectRatio: number): number {
  return Math.ceil(fixedWidth * aspectRatio);
}

export function calculateNewWidth(fixedHeight: number, aspectRatio: number): number {
  return Math.ceil(fixedHeight / aspectRatio);
}

export function figureIsBiggerThan(targFigureWidth: number, targFigureHeight: number, toCompFigureWidth: number, toCompFigureHeight: number): boolean {
  return targFigureHeight > toCompFigureHeight || targFigureWidth > toCompFigureWidth;
}

export function calculateAspectRatio(height: number, width: number): number {
  return (height / width);
}

export function imageBestFit(image: HTMLImageElement, container: HTMLElement, aspectRatio?: number): Size {
  const returnValue = {height: null, width: null};
  const imageAspectRatio = aspectRatio ? aspectRatio : calculateAspectRatio(image.naturalHeight, image.naturalWidth);
  // Fixing the width and calculating the corresponding height keeping the aspect ratio
  const heightWithFixedWidth = calculateNewHeight(container.clientWidth, imageAspectRatio);
  // Fixing the height and calculating the corresponding width keeping the aspect ratio
  const WidthWithFixedHeight = calculateNewWidth(container.clientHeight, imageAspectRatio);
  // Checking if with the fixed width and the corresponded height fit in the container
  if (!figureIsBiggerThan(container.clientWidth, heightWithFixedWidth, container.clientWidth, container.clientHeight)) {
    returnValue.height = heightWithFixedWidth;
    returnValue.width = container.clientWidth;
  } else {
    returnValue.height = container.clientHeight;
    returnValue.width = WidthWithFixedHeight;
  }
  return returnValue;
}

export function isAValidSize(size: Size): boolean {
  return size.width !== undefined && size.width !== null && size.height !== undefined && size.height !== null;
}
