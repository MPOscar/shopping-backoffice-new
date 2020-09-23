import { SelectedShop } from "../../ms-shops/models/selected-shop";
import { Brand } from "../../ms-brands/models/brand";
import { Category } from "../../ms-categories/models/category";

export class Style {

    brand: string;

    category?: string;

    categories: string[]; // TODO: improve

    createRelease?: boolean;

    createdAt?: string;

    description: string;

    id?: string;

    isParent?: boolean;

    linkedShops?: Array<SelectedShop>;

    name: string;

    parent?: string;

    updatedAt?: string;

    selected?: boolean = false;

}


export class StylesListResponse {
    data: Style[];
    dataCount: number;
}

export class StyleResponse {
    data: Style;
}
