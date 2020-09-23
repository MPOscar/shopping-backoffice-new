import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

export class WeekHours {
  dayOfWeek?: number;
  openHour?: string;
  closeHour?: string;
  shopId?: string;
  offWork?: boolean;
}

export class ShopImage {
  id?: string;

  createdBy?: string;

  updatedBy?: string;

  createdAt?: string;

  updatedAt?: string;

  fileName?: string;

  imgUrl?: string;

  state?: State;

  status?: Status;

  file?: File;

  mainImage?: boolean;
}

export class Shop {

  active?: boolean;

  address?: string;

  brand?: string;

  brands?: string[];

  category?: string;

  categories?: string[];

  createdAt?: Date;

  currency?: string;

  createdBy?: Date;

  description?: string;

  faces?: Array<Face>;

  id?: string;

  images?: Array<Face>;

  makeDeal?: boolean;

  mainImage?: string;

  smallImage?: string;

  headerImage?: string;

  name: string;

  type?: string;

  rank?: number;

  region?: string;

  country?: string;

  shippingDetails?: string;

  shippingCountries?: string;

  showOnRegion?: string;

  countries?: any;

  trackingListBaseUrl?: string;

  updatedAt?: Date;

  workingHours?: Array<WeekHours>;

  linked?: boolean;

  displayOnBrands?: boolean;

  checkedDisplayOnBrands?: boolean;

  checked?: boolean;

  zipCode?: string;

  isParent?: boolean;

  parent?: string;

  lat?: number;

  lon?: number;

  defaultOfferLabel?: string;

  hasLink?: boolean;
}


export class ShopsListResponse {
  data: Shop[];
  dataCount: number;
}

export class ShopsResponse {
  data: Shop;
}

export class ShopsImagesListResponse {
  data: Array<Face>;
  dataCount: number;
}


export class ShopImagesResponse {
  data: Face[];
}

export class EditShopModel extends Shop {

  deletedFaces?: Array<string>;
}
