import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
//
import { Style } from '../../models/style';
import { CustomTreeControl } from '../../models/custom-tree-control';
import { TreeItemFlatNode } from '../../models/tree-item-flat-node';
import { TreeItemNode } from '../../models/tree-item-node';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'styles-parent',
    templateUrl: 'styles-parent.component.html',
    styleUrls: ['styles-parent.component.css'],
})
export class ParentStylesTreeRadioButonslist implements OnInit {
    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();

    /** The new item's name */
    newItemName = '';

    treeControl: CustomTreeControl<TreeItemFlatNode>;

    treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;

    dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>;

    dataChange = new BehaviorSubject<TreeItemNode[]>([]);

    @Input() parent: string;

    @Input() parentId: string;

    @Input() styleId: string;

    _styles: Array<Style>;

    @Input() styleName: string;

    @Output() styleEventEmiter: EventEmitter<any> = new EventEmitter();

    selectedStyleParent = new FormControl();

    styleParent: Array<string> = [];

    treeNode: any[] = [];

    // data: any = [];

    nodes: Array<TreeItemNode>;

    check: Array<boolean>;

    constructor() {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new CustomTreeControl<TreeItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    get styles(): Array<Style> {
        return this._styles;
    }

    @Input()
    set styles(styles: Array<Style>) {
        this._styles = styles;
        this.dataSource.data = this.buildTree(styles);
        if (!this.findStyleByName(this.parent)) {
            this.deselectNode();
        }
    }

    getLevel = (node: TreeItemFlatNode) => node.level;

    isExpandable = (node: TreeItemFlatNode) => node.expandable;

    getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.item === '';

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
        flatNode.expandable = node.children && node.children.length > 0;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    ngOnInit() {
        // this.buildTreeArray(this.styles);
        if (this.parent) {
            this.selectedStyleParent.setValue(this.parent);
        }
    }

    findStyle(styleId: string) {
        return this.styles.findIndex(style => style.id === styleId) !== -1;
    }

    findStyleByName(name: string) {
        return this.styles.findIndex(style => style.name === name) !== -1;
    }

    /**
    * Build the file structure tree.
    * The return value is the list of `TreeItemNode`.
    */
    buildTree(styles: Array<Style>): TreeItemNode[] {
        this.check = new Array(styles.length).fill(false);
        this.nodes = new Array(styles.length);
        const tree: TreeItemNode[] = [];
        styles.forEach((style: Style, i: number) => {
            if (!style.parent || !this.findStyle(style.parent)) {
                this.check[i] = true;
                tree.push(this.dfs(i, 0, styles));
            }
        });
        return tree;
    }

    dfs(index: number, level: number, styles: Array<Style>): TreeItemNode {
        const node: TreeItemNode = new TreeItemNode();
        const style: Style = styles[index];
        node.item = style.name;
        node.level = level;
        node.style = style;
        node.children = [];
        this.nodes[index] = node;
        styles.forEach((child: Style, i: number) => {
            if (child.parent === style.id && !this.check[i]) {
                this.check[i] = true;
                node.children.push(this.dfs(i, level + 1, styles));
            }
        });
        return node;
    }

    selectNode(event: Event, node: any) {
        event.preventDefault();
        if (!this.checkedNode(node)) {
            this.styleEventEmiter.emit(node.item);
            this.styleParent = [node.item];
            this.selectedStyleParent.setValue(node.item);
            this.parent = node.item;
        } else {
            this.deselectNode();
        }
    }

    deselectNode() {
        this.styleEventEmiter.emit('None');
        this.styleParent = [];
        this.selectedStyleParent.reset();
        this.parent = '';
    }

    checkedNode(node: any) {
        return node.item === this.parent;
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    filterChanged(filterText: string) {
        this.filter(filterText);
        if (filterText) {
            this.treeControl.expandAll();
        } else {
            this.treeControl.collapseAll();
        }
    }

    filter(filterText: string) {
        let filteredTreeData;
        if (filterText) {
            filteredTreeData = this.styles.filter(d => d.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
            Object.assign([], filteredTreeData).forEach(ftd => {
                if (ftd.parent) {
                    const obj = this.styles.find(s => s.id === ftd.parent);
                    if (obj) {
                        filteredTreeData.push(obj);
                    }
                }
            });
        } else {
            filteredTreeData = this.styles;
        }
        this.dataSource.data = this.buildTree(filteredTreeData);
    }
}
