export class link {
  text: string;
  url: string;
  name?: string;
  trackedUrl?: string;
}

export class Offer {

  description?: string;

  displayOnSale?: boolean;

  offerDate?: string;

  timezone?: string;

  id?: string;

  name: string;

  imgUrl?: string;

  updatedAt?: string;

  createdAt?: string;

  shopId?: string;

  retailPrice?: number;

  retailCurrency?: string;

  status?: string;

  releaseId?: string;

  releaseTime?: string;

  releaseTimeZone?: string;

  raffleStart?: string;

  raffleEnd?: string;

  salePrice?: number;

  salePercentage?: number;

  shipping?: string;

  countries?: any;

  displayOnWhatsNew?: boolean;

  price?: number;

  priceUSD?: number;

  priceEUR?: number;

  priceGBP?: number;

  links?: link[];

  raffle?: any;

  linked?: boolean;

  checked?: boolean;

  displayWhatsNew?: boolean;

  shopRank?: number;
}

export class OffersListResponse {
  data: Offer[];
  dataCount: number;
}

export class OfferResponse {
  data: Offer;
}
