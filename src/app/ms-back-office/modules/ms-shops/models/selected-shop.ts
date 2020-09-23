export class SelectedShop {
    shopId?: string;
    linkText?: string;
    linkUrl?: string;
    isParent?: boolean;
  }
  
  export class SelectedShopListResponse {
    data: SelectedShop[];
    dataCount: number;
  }
  
  export class SelectedShopResponse {
    data: SelectedShop;
  }