
import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

export class Collection {
  id?: string;
  name: string;
  brand?: string;
  createdAt?: string;
  description?: string;
  faces?: Array<Face>;
  images?: Array<Face>;
  imgUrl?: string;
  updatedAt?: string;
}

export class CollectionsListResponse {
  data: Collection[];
  dataCount: number;
} 

export class CollectionResponse {
  data: Collection;
}