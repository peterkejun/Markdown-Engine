/*
This module has building-block classes for an Abstract Syntax Tree.
*/

import { ElementType } from './ElementType';
import { ElementStyle } from './ElementStyle';

export class ASTNode {
    // array of child nodes, order matters
    private children: Array<ASTNode>;

    constructor() {
        // initialize as a leaf
        this.children = [];
    }

    // This function adds an ASTNode as a child, order matters
    addChildNode = (childNode: ASTNode): void => {
        this.children.push(childNode);
    }

    // This function calls callback for all child nodes.
    // This is the only way to traverse all child nodes.
    mapChildNodes = (cb: (childNode: ASTNode) => void) => {
        for (let i = 0; i < this.children.length; i++) {
            cb(this.children[i]);
        }
    }
}

// A dummy root node, only exist once in an AST
export class ASTRootNode extends ASTNode {

}

// A type node for indicating element type
export class ASTTypeNode extends ASTNode {
    // type of element, e.g. H1, H5, TEXT, BLOCKQUOTE
    private type: ElementType;

    constructor(type: ElementType) {
        super();
        this.type = type;
    }

    // getter for element type
    get elementType(): ElementType {
        return this.type;
    }
}

// A style node for indicating element style
export class ASTStyleNode extends ASTNode {
    // style of element, e.g. bold, italic, strikethrough
    private style: ElementStyle;

    constructor(style: ElementStyle) {
        super();
        this.style = style;
    }

    // getter for element style
    get elementStyle(): ElementStyle {
        return this.style;
    }
}

// A content node for storing raw text
export class ASTContentNode extends ASTNode {
    // raw text
    private text: string;

    constructor(text: string) {
        super();
        this.text = text;
    }

    // getter for raw text
    get contentText(): string {
        return this.text;
    }
}

