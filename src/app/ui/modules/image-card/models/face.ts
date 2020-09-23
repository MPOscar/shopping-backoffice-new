import { Landmarks } from './landmarks';

export enum State {
  New,
  Edited,
  Deleted,
}

export enum Status {
  Pending,
  Uploading,
  Uploaded,
  Error
}

export class Face {
  id?: string;

  createdBy?: string;

  updatedBy?: string;

  createdAt?: string;

  updatedAt?: string;

  fileName?: string;

  imgUrl?: string

  state?: State;

  status?: Status;

  file?: File;

  mainImage?: boolean;


  constructor(file: File) {
    this.file = file;
    this.fileName = file.name;
    this.state = State.New;
    this.status = Status.Pending;
  }
}


export class MainImage {
  mainImage: string
}