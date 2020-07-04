import { ElementType, incrementHeadingType, isHeading, getTypeDelimiter } from './ElementType';
import { ElementStyle, getStyleDelimiter } from './ElementStyle';
import { ASTRootNode, ASTTypeNode, ASTStyleNode, ASTNode, ASTContentNode } from './AST';
import Stack from './helpers/Stack';

/*
This is an interface for the return type of function "identifyElement".
*/
interface IdentifyElementResult {
    // exclusive
    endIndex: number,
    // type exists if identified element indicates a type, i.e. H1, H3, CODE
    type?: ElementType,
    // style exists if identified element indicates a style, i.e. bold, italic, strikethrough
    style?: ElementStyle,
    /*
    Content is,
    1. raw text if identified element indicates a text
    2. type description (e.g. h1, code, blockquote) if identified element indicates a type
    3. style description (e.g. bold, italic, strikethrough) if identified element indicates a style
    */
    content: string,
};

/*
This is an interface for suspected type and style of an element, used in function "identifyElement".
*/
interface Suspect {
    type?: ElementType,
    style?: ElementStyle,
};

/*
This function identifies the next element in text starting from an index. 
!!! Notice that this function does not guarantee validity of elements, it only finds the pattern, i.e. #, ```, **, abc
The identified element could be a type, style, or text.
O(k) where k is the indication length (<= actual length) of the next element.
*/
const identifyElement = (text: string, startIndex: number = 0): IdentifyElementResult => {
    // no suspect at first
    let suspect: Suspect = { type: undefined, style: undefined };
    // index to go through each character
    let i = startIndex;
    // go through each character
    for (; i < text.length; i++) {
        // heading
        if (text[i] === '#') {
            // if first character is "#", suspect is H1
            if (i === startIndex) {
                suspect.type = ElementType.H1;
            }
            // if already suspected to be a heading, increment heading, i.e. H2 => H3
            else if (suspect.type && isHeading(suspect.type)) {
                suspect.type = incrementHeadingType(suspect.type);
            }
            // otherwise, it indicates the end of the previous suspect, so identification is finished.
            else {
                break;
            }
        }
        // code
        else if (text[i] === '`') {
            // if the next two characters, if any, are also "`"
            if (i + 2 < text.length && text[i + 1] === '`' && text[i + 2] === '`') {
                // if this is the first character, guarantee this element is code
                if (i === startIndex) {
                    // increment index for next identification
                    i += 3;
                    suspect.type = ElementType.CODE;
                    break;
                }
                // otherwise, it indicates the end of the previous suspect, so identification is finished.
                else {
                    break;
                }
            }
        }
        // bold & italic
        else if (text[i] === '*') {
            // if this is not the first character, it indicates the end of the previous suspect, so identification is finished.
            if (i !== startIndex) {
                break;
            }
            // if the next character is also "*", guarantee this is bold
            else if (i + 1 < text.length && text[i + 1] === '*') {
                // increment i for next identification
                i += 2;
                suspect.style = ElementStyle.BOLD;
                break;
            }
            // by now, the character is the first character and the element is not bold, so it must be italic
            i++;
            suspect.style = ElementStyle.ITALIC;
            break;
        }
        // blockquote
        else if (text[i] === '>') {
            // no conditions, if ">" detected, it must be blockquote
            i++;
            suspect.type = ElementType.BLOCKQUOTE;
            break;
        }
        // new line
        else if (text[i] === '\n') {
            // if new line is the first character, this is a new line element
            if (i === startIndex) {
                i++;
                suspect.type = ElementType.NEWLINE;
            }
            // otherwise, it indicates the end of the previous suspect, so identification is finished.
            break;
        }
        // text
        else {
            // if there is a suspect type but it's not text, then this indicates the end of the previous suspect, so identification is finished.
            if (suspect.type && suspect.type !== ElementType.TEXT) {
                break;
            }
            // if there is a suspect style but it's not none, then this indicates the end of the previous suspect, so identification is finished.
            else if (suspect.style && suspect.style !== ElementStyle.NONE) {
                break;
            }
            // suspect this element to be text
            suspect.type = ElementType.TEXT;
        }
    }
    // return results
    return {
        // starting index for next identification
        endIndex: i,
        // suspected type if any
        type: suspect.type,
        // suspected style if any
        style: suspect.style,
        // text sample for this element, trimmed
        content: text.slice(startIndex, i).trim(),
    };
}

/*
This function returns an Abstract Syntax Tree (root node) built from input string. 
Time: O(n), Space: O(n), n being length of text
*/
const buildAST = (text: string): ASTRootNode => {
    // root node of AST
    const root = new ASTRootNode();
    // a stack to trace opening (unresolved) type and style
    const stack = new Stack<ASTNode>();
    // previous node -> current node
    let previousNode: ASTNode = root;
    let currentNode: ASTNode = root;
    // index to loop through text
    let i = 0;
    while (i < text.length) {
        // skip if this character is a space, because space has no significance in building the AST
        if (text[i] === ' ') {
            i++;
            continue;
        }
        // identify next element starting at index i
        const { endIndex, type, style, content } = identifyElement(text, i);
        // this node is a content node
        if (type === ElementType.TEXT && content) {
            // create new node with content text
            const contentNode = new ASTContentNode(content);
            // add node to current leaf
            currentNode.addChildNode(contentNode);
        }
        // this node is a type node
        else if (type) {
            // create new node with type
            const typeNode = new ASTTypeNode(type);
            // get unresolved type on stack
            const topNode = stack.peek();
            // this is a closing type node, resolve
            if (topNode && topNode instanceof ASTTypeNode && getTypeDelimiter(topNode.elementType) === type) {
                // resolve this type on stack by popping it
                stack.pop();
                // add closing type to current leaf
                currentNode.addChildNode(typeNode);
                // go back one level up the tree
                currentNode = previousNode;
                previousNode = stack.peek(2) || root;
            }
            // this is an opening type node
            else {
                // add unresolved type to stack
                stack.push(typeNode);
                // add opening type to current leaf
                currentNode.addChildNode(typeNode);
                // go one level deeper
                previousNode = currentNode;
                currentNode = typeNode;
            }
        }
        // this node is a style node
        else if (style) {
            // create new node with style
            const styleNode = new ASTStyleNode(style);
            // get unresolved style on stack
            const topNode = stack.peek();
            // this is a closing style node, resolve
            if (topNode && topNode instanceof ASTStyleNode && getStyleDelimiter(topNode.elementStyle) === style) {
                // resolve this style on stack by popping it
                stack.pop();
                // add closing style to current leaf
                currentNode.addChildNode(styleNode);
                // go back one level up the tree
                currentNode = previousNode;
                previousNode = stack.peek(2) || root;
            }
            // this is an opening style node
            else {
                stack.push(styleNode);
                // add opening style to current leaf
                currentNode.addChildNode(styleNode);
                // go one level deeper
                previousNode = currentNode;
                currentNode = styleNode;
            }
        }
        i = endIndex;
    }
    return root;
}

/*
This function simulates building an Abstract Syntax Tree but only prints out identified elements.
Time: O(n)
*/
const printIdentificationProcess = (text: string): void => {
    let i = 0;
    while (i < text.length) {
        if (text[i] === ' ') {
            i++;
            continue;
        }
        const element = identifyElement(text, i);
        console.log(element);
        i = element.endIndex;
    }
};

const text = '### heading 3 * with italic **is here** * is not here.';
const ast = buildAST(text);
// printIdentificationProcess(text);
