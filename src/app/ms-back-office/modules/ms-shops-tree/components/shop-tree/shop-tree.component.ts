import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TreeItemNode } from '../../models/tree-item-node';
import { TreeItemFlatNode } from '../../models/tree-item-flat-node';
import { EditLinkComponent } from '../../../ms-links/components/edit-link/edit-link.component';
import { Link } from '../../../ms-links/models/urls';
import { CustomTreeControl } from '../../models/custom-tree-control';
import { Shop } from '../../../ms-shops/models/shops';
import { SelectedShop } from '../../../ms-shops/models/selected-shop';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-shop-tree',
    templateUrl: './shop-tree.component.html',
    styleUrls: ['./shop-tree.component.scss']
})
export class ShopTreeComponent implements OnInit, OnDestroy {

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();

    /** A selected parent node to be inserted */
    selectedParent: TreeItemFlatNode | null = null;

    /** The new item's name */
    newItemName = '';

    treeControl: CustomTreeControl<TreeItemFlatNode>;

    treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;

    dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>;

    _shops: Array<Shop>;

    _linkedShops: Array<SelectedShop>;

    modalRef: MatDialogRef<EditLinkComponent>;

    subscriptions: Array<Subscription> = [];

    nodes: Array<TreeItemNode>;

    check: Array<boolean>;

    @Input() release = false;

    constructor(public dialog: MatDialog) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new CustomTreeControl<TreeItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    get shops(): Array<Shop> {
        return this._shops;
    }

    @Input()
    set shops(shops: Array<Shop>) {
        this._shops = shops;
        this.dataSource.data = this.buildTree();
        this.selectLinkedShops();
    }

    get linkedShops(): Array<SelectedShop> {
        return this._linkedShops;
    }

    @Input()
    set linkedShops(linkedShops: Array<SelectedShop>) {
        this._linkedShops = linkedShops;
        this.selectLinkedShops();
    }

    selectLinkedShops() {
        if (this.linkedShops) {
            this.linkedShops.forEach(shop => {
                this.selectShop(shop);
            });
        }
    }

    ngOnInit() {

    }

    findShop(shopId: string) {
        return this.shops.findIndex(shop => shop.id === shopId) !== -1;
    }

    /**
   * Build the file structure tree.
   * The return value is the list of `TreeItemNode`.
   */
    buildTree(): TreeItemNode[] {
        this.check = new Array(this.shops.length).fill(false);
        this.nodes = new Array(this.shops.length);
        const tree: TreeItemNode[] = [];
        this.shops.forEach((shop: Shop, i: number) => {
            if (!shop.parent || !this.findShop(shop.parent)) {
                this.check[i] = true;
                tree.push(this.dfs(i, 0));
            }
        });
        return tree;
    }

    dfs(index: number, level: number): TreeItemNode {
        const node: TreeItemNode = new TreeItemNode();
        const shop: Shop = this.shops[index];
        node.item = shop.name;
        node.level = level;
        node.shop = shop;
        node.children = [];
        this.nodes[index] = node;
        this.shops.forEach((child: Shop, i: number) => {
            if (child.parent === shop.id && !this.check[i]) {
                this.check[i] = true;
                node.children.push(this.dfs(i, level + 1));
            }
        });
        return node;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    getLevel = (node: TreeItemFlatNode) => node.level;

    isExpandable = (node: TreeItemFlatNode) => node.expandable;

    getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.expandable;

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TreeItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.item === node.item
            ? existingNode
            : new TreeItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.shop = node.shop;
        flatNode.expandable = node.children && node.children.length > 0;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected */
    descendantsAllSelected(node: TreeItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.treeControl.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TreeItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.treeControl.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TreeItemFlatNode): void {
        if (!this.descendantsPartiallySelected(node)) {
            this.treeControl.toggleNode(node);
        }
        const descendants = this.treeControl.getDescendants(node);
        this.treeControl.isSelected(node)
            ? this.treeControl.select(...descendants)
            : this.treeControl.deselect(...descendants);
    }

    getNode(shopId: string): TreeItemNode {
        const index: number = this.nodes.findIndex(node => node && node.shop.id === shopId);
        if (index !== -1) {
            return this.nodes[index];
        }
        return new TreeItemNode();
    }

    selectShop(shop: SelectedShop): void {
        const node: TreeItemNode = this.getNode(shop.shopId);
        const flatNode: TreeItemFlatNode = this.nestedNodeMap.get(node);
        if (flatNode) {
            flatNode.linkText = shop.linkText;
            flatNode.linkUrl = shop.linkUrl;
            if (!this.treeControl.isSelected(flatNode)) {
                this.treeControl.toggleNode(flatNode);
            }
        }
    }

    getAllSelectedShops(): SelectedShop[] {
        const selectedShops: SelectedShop[] = [];
        this.shops.forEach((shop: Shop) => {
            const node: TreeItemNode = this.getNode(shop.id);
            const flatNode: TreeItemFlatNode = this.nestedNodeMap.get(node);
            let isShopSelected = false;

            if (flatNode && flatNode.expandable) {
                if (this.descendantsAllSelected(flatNode) || this.descendantsPartiallySelected(flatNode)) {
                    isShopSelected = true;
                }
            } else {
                if (this.treeControl.isSelected(flatNode)) {
                    isShopSelected = true;
                }
            }
            if (isShopSelected) {
                selectedShops.push({
                    shopId: shop.id,
                    linkText: flatNode.linkText,
                    linkUrl: flatNode.linkUrl,
                    isParent: shop.isParent
                });
            }
        });
        return selectedShops;
    }

    editLinkModal(flatNode: TreeItemFlatNode) {
        this.modalRef = this.dialog.open(EditLinkComponent, {
            data: {
                data: {
                    linkUrl: flatNode.linkUrl,
                    linkText: flatNode.linkText
                },
                shop: flatNode.shop
            }
        });
        const subAfterClosed = this.modalRef.afterClosed().subscribe((link: Link) => {
            if (link) {
                flatNode.linkText = link.linkText;
                flatNode.linkUrl = link.linkUrl;
            }
        });
        this.subscriptions.push(subAfterClosed);
    }
}

