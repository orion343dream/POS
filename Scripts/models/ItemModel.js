export default class ItemModel {
    constructor(id, name, price, qty, category) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._qty = qty;
        this._category = category;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }
}