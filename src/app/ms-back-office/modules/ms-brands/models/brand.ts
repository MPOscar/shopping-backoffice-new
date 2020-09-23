import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

export class Brand {
  id?: string;
  name: string;
  description?: string;
  imgUrl?: string;
  updatedAt?: string;
  createdAt?: string;
  images?: Array<Face>;
  faces?: Array<Face>;
  popularStyle?: any;
}

export class BrandsListResponse {
  data: Brand[];
  dataCount: number;
}

export class BrandResponse {
  data: Brand;
} 

export class LinkedShop {
  shopId: string;
  displayOnBrands: boolean;
}