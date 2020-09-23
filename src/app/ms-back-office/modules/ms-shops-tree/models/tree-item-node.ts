import { Shop } from '../../ms-shops/models/shops';

export class TreeItemNode {
    item: string;
    level: number;
    shop: Shop;
    children: TreeItemNode[];
}
