import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

import { FilterItem } from './filters';

export class HeaderColumn {
    url?: string;
    name?: string;
    imgUrl?: string;
    filter?: Array<any>;
    filters?: Array<any>;
}

export class LayoutHeader {
    itemsPerColumn?: string;
    columns?: HeaderColumn;
    images?: any;
    faces?: any;
}

export class LayoutHeaderResponce {
    data?: Array<LayoutHeader>;
}

export class LayoutSlider {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    url?: string;
    vanityUrl?: string;
    filters?: Array<FilterItem>;
    filter?: any;
    filtersActive?: any;
    images?: Array<any>;
    faces?: Array<Face>;
    numberOfItem?: string;
}

export class LayoutHeading {
    id?: string;
    title?: string;
    keywords?: string;
    description?: string;
    displayOnPage?: boolean;
    imgUrl?: string;
    images?: Array<Face>;
    filters?: Array<any>;
}

export class UrlsListResponse {
    data: LayoutSlider[];
    dataCount: number;
}

export class UrlsResponse {
    data: LayoutSlider;
}

export class Slide {
    id?: string;
    type: string;
    entityType: string;
    entityId: string;
    description: string;
    imgUrl?: string;
}

export class MenuBrandsItem {
    id?: string;
    entityId: string;
    imgUrl?: string;
    collections: Array<string>;
    styles: Array<string>;
}

export class MenuBrands {
    id?: string;
    slides: Array<MenuBrandsItem>;
}

export class OurPartner {
    id?: string;
    label?: string;
    layoutId?: string;
    slides?: Array<Slide>;
}

export class Slider {
    id?: string;
    label?: string;
    layoutId?: string;
    slides?: Array<Slide>
    display?: string;
    displayOnPage?: boolean;
    imgUrl?: string;
    images?: Array<Face>;
}

export class Header {
    link?: string;
    layoutId?: string;
    display?: string;
    description?: string;
    label?: string;
    displayOnPage?: boolean;
    imgUrl?: string;
    images?: Array<Face>;
}

export class Hottest {
    displayOnPage?: boolean;
    display: string;
}
