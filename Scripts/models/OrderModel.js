export class OrderModel {
    constructor(id, date, customerId, items, total) {
        this._id = id;
        this._date = date;
        this._customerId = customerId;
        this._items = items;
        this._total = total;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        this._customerId = value;
    }

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }
}

export class OrderItemModel {
    constructor(itemId, name, qty, unitPrice) {
        this._itemId = itemId;
        this._name = name;
        this._qty = qty;
        this._unitPrice = unitPrice;
    }


    get itemId() {
        return this._itemId;
    }

    set itemId(value) {
        this._itemId = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get unitPrice() {
        return this._unitPrice;
    }

    set unitPrice(value) {
        this._unitPrice = value;
    }
}

