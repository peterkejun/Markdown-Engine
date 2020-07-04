/*
This is a wrapper of Array that provides a Stack API.
Functions: size, push, pop, peek, clear
*/
class Stack<T> {

    // array of items
    private items: Array<T>;

    constructor() {
        // no items at first
        this.items = [];
    }

    // getter for number of items in stack
    get size(): number {
        return this.items.length;
    };

    // This function pushs an item to the stack
    push = (item: T): void => {
        this.items.push(item);
    }

    // This function pops an item from stack and return it
    pop = (): T | null => {
        // get top item
        const item = this.peek();
        // remove top item
        this.items.pop();
        // return top item
        return item;
    }

    /*
    This function returns top item if depth is not given, and returns the item at depth otherwise.
    Depth is counted from the top of the stack, i.e. depth = 1 means the top item, depth = 2 means the second top item.
    */
    peek = (depth: number = 1): T | null => {
        if (depth && this.size >= depth) return this.items[this.size - depth];
        return null;
    }

    // This function clears the stack. 
    clear = (): void => {
        this.items = [];
    }
}

export default Stack;