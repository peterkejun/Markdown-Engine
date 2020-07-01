module.exports = class Stack<T> {

    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    get size(): number {
        return this.items.length;
    };

    push = (item: T): void => {
        this.items.push(item);
    }

    pop = (): T | null => {
        const item = this.peek();
        this.items.pop();
        return item;
    }

    peek = (): T | null => {
        if (this.size === 0) return null;
        return this.items[this.size - 1];
    }

    clear = (): void => {
        this.items = [];
    }
}