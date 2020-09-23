import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';
import { link } from '../../ms-offers/models/offer';

export class Deal {
  createdAt?: string;
  displayOnSale?: boolean;
  faces?: Array<Face>;
  id?: string;
  images?: Array<Face>;
  imgUrl?: string;
  promoCode?: string;
  salePercentage?: string;
  status?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  time?: string;
  shopId?: string;
  updatedAt?: string;
  url?: string;
  trackedUrl?: string;
}

export class DealsListResponse {
  data: Deal[];
  dataCount: number;
}

export class DealResponse {
  data: Deal;
} 