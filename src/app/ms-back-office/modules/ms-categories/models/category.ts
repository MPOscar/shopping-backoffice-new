import { Face } from "src/app/ui/modules/images-card/models/face";

export class Category {
    id?: string;
    name: string;
    description: string;
    imgUrl?: string;
    faces?: Array<Face>;
    updatedAt?: string;
    createdAt?: string;
}

export class CategoriesListResponse {
    data: Category[];
    dataCount: number;
} 

export class CategoriesResponse {
    data: Category;
} 