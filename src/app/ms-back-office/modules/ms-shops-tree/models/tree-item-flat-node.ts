import {Shop} from '../../ms-shops/models/shops';

export class TreeItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
    linkText: string;
    linkUrl: string;
    shop: Shop;
}
