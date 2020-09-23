import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

export class MainImage {
    mainImage: string
}

export class ReleaseImage {
    id?: string;

    createdBy?: string;

    updatedBy?: string;

    createdAt?: string;

    updatedAt?: string;

    fileName?: string;

    imgUrl?: string

    state?: State

    status?: Status;

    file?: File;

    mainImage?: boolean;

    position?: number
}

export class Release {
    id?: string;

    name: string;

    slug: string;

    collectionId?: string;

    children?: boolean;

    color?: any;

    currency?: string;

    description?: string;

    sku?: string;

    images?: ReleaseImage[];

    gender?: string;

    hot?: boolean;

    mainImage?: string;

    price?: number;

    priceUSD?: number;

    priceEUR?: number;

    priceGBP?: number;

    releaseDate?: Date;

    updatedAt?: Date;

    createdAt?: Date;

    faces?: Array<Face>;

    supplierColor?: string;

    upcoming?: boolean;

    customized?: boolean;

    notSchedule?: boolean;

    styleId?: string;

    offers?: Array<any>;
}

export class ReleasesListResponse {
    data: Release[];
    dataCount: number;
}

export class ReleasesImagesListResponse {
    data: ReleaseImage[];
    dataCount: number;
}

export class ReleaseResponse {
    data: Release;
}

export class ReleaseImagesResponse {
    data: Array<ReleaseImage>;
}

export class EditReleaseModel extends Release {

    deletedFaces?: Array<string>;
}
