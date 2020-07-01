"use strict";
module.exports = /** @class */ (function () {
    function Stack() {
        var _this = this;
        this.push = function (item) {
            _this.items.push(item);
        };
        this.pop = function () {
            var item = _this.peek();
            _this.items.pop();
            return item;
        };
        this.peek = function () {
            if (_this.size === 0)
                return null;
            return _this.items[_this.size - 1];
        };
        this.clear = function () {
            _this.items = [];
        };
        this.items = [];
    }
    Object.defineProperty(Stack.prototype, "size", {
        get: function () {
            return this.items.length;
        },
        enumerable: false,
        configurable: true
    });
    ;
    return Stack;
}());
