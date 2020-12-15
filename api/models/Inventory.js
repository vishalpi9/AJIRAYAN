const constants = require("../constants")

class Inventory {

    constructor(length) {
        this.spaceLimit = length;
        this.totalItems = 0;
        this.items = new Array(); //Priority Queue Implemeted with Array, could have used Linked List or Graph.
        this.filledWithMax = false;
    }

    push(item) {
        var pushed = false;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority == item.priority) {
                this.items[i].quantity += item.quantity;
                this.totalItems += item.quantity;
                pushed = true;
                break;
            }
        }
        if (!pushed) {
            var node = new Node(item.type, item.priority, item.quantity);
            this.totalItems += item.quantity;
            this.items.push(node);
        }

        if (this.totalItems > this.spaceLimit) {
            let freeUpSpace = this.totalItems - this.spaceLimit
            for (var j = this.items.length - 1; j > 0; j--) {
                if (this.items[j].quantity == freeUpSpace) {
                    this.totalItems -= this.items[j].quantity;
                    this.items.splice(j, 1); break;
                } else if (this.items[j].quantity > freeUpSpace) {
                    this.totalItems -= freeUpSpace;
                    this.items[j].quantity -= freeUpSpace; break;
                } else {
                    this.totalItems -= this.items[j].quantity;
                    freeUpSpace -= this.items[j].quantity;
                    this.items.splice(j, 1);
                }
            }
        }
    }

    pop() {
        if (this.isEmpty())
            return null;
        return this.items.shift();
    }

    getInventory() {
        return this.items;
    }

    printInventory() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].type + " " + this.items[i].quantity + " ";
        return str;
    }
    utilize(item) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].type == item.type && this.items[i].quantity >= item.qty) {
                this.items[i] -= item.qty;
                return true;
            }
        }
        return false;
    }
}

class Node {
    constructor(type, priority, quantity) {
        this.type = type;
        this.priority = priority;
        this.quantity = quantity;
    }
}

module.exports = Inventory;

//Dev-test
// let inv = new Inventory(10);
// console.log(inv.getInventory())
// inv.push("shield", 1, 4);
// console.log(inv.printInventory())

// inv.push("water", 2, 5);
// console.log(inv.printInventory())

// inv.push("rock", 3, 5);
// console.log(inv.printInventory())

// inv.push("shield", 1, 2);
// console.log(inv.printInventory())
// console.log(inv.getInventory())