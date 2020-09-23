import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';

export class CustomTreeControl<T> extends FlatTreeControl<T> {

    /** The selection for checklist */
    checklistSelection = new SelectionModel<T>(true /* multiple */);

    /**
     * Recursively expand all parents of the passed node.
     */
    expandParents(node: T) {
        const parent = this.getParent(node);
        this.expand(parent);

        if (parent && this.getLevel(parent) > 0) {
            this.expandParents(parent);
        }
    }

    isSelected(node: T): boolean {
        return this.checklistSelection.isSelected(node);
    }

    toggleNode(node: T) {
        this.checklistSelection.toggle(node);
        const parent = this.getParent(node);
        if (parent && this.hasToggle(parent)) {
            this.toggleNode(parent);
        }
    }

    hasToggle(node: T): boolean {
        const descendants = this.getDescendants(node);
        const someChildSelected: boolean = descendants.some(child => this.isSelected(child));
        return (this.isSelected(node) && !someChildSelected) ||
            (!this.isSelected(node) && someChildSelected);
    }

    select(...nodes: T[]) {
        this.checklistSelection.select(...nodes);
    }

    deselect(...nodes: T[]) {
        this.checklistSelection.deselect(...nodes);
    }

    /**
     * Iterate over each node in reverse order and return the first node that has a lower level than the passed node.
     */
    getParent(node: T): T {
        const currentLevel = this.getLevel(node);

        let parent: T = null;

        if (currentLevel > 0) {
            const startIndex = this.dataNodes.indexOf(node) - 1;
            for (let i = startIndex; i >= 0 && !parent; i--) {
                const currentNode = this.dataNodes[i];

                if (this.getLevel(currentNode) < currentLevel) {
                    parent = currentNode;
                }
            }
        }
        return parent;
    }
}
