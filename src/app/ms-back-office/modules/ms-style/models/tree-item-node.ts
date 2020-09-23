import { Style } from "./style";

export class TreeItemNode {
    item: string;
    level: number;
    style: Style;
    children: TreeItemNode[];
}
