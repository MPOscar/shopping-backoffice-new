import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

export class Blog {
    author: string;
    brandId?: string;
    id?: string;
    title?: string;
    body?: string;
    imgUrl?: string;
    images?: Array<Face>;
    faces?: Array<Face>;
    updatedAt?: string;
    createdAt?: string;
    type?: string;
    mainImage?: string;
}

export class BlogsListResponse {
    data: Blog[];
    dataCount: number;
}

export class BlogsResponse {
    data: Blog;
} 