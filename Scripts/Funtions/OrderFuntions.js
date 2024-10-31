import { customer_array } from "../../db/database.js";
import { item_array } from "../../db/database.js";
import { order_array } from "../../db/database.js";

console.log("Customers:", customer_array);
console.log("Items:", item_array);

class OrderFuntions {
    constructor() {
        this.cartItems = [];
        this.selectedCustomerId = null;
        this.bindEvents();
        this.loadInitialData();
    }

    bindEvents() {
        $("#customer-select").on('change', (e) => this.handleCustomerSelect(e));
        $("#item-select").on('change', (e) => this.handleItemSelect(e));
        $("#add-item").on('click', () => this.addToCart());
        $("#clear-cart").on('click', () => this.clearCart());
        $("#place-order").on('click', () => this.placeOrder());
    }

    loadInitialData() {
        this.loadCustomers();
        this.loadItems();
        this.setOrderInfo();
    }

    loadCustomers() {
        const select = $("#customer-select");
        select.empty();
        select.append(`<option value="">Select Customer</option>`);

if (customer_array && customer_array.length) {
    customer_array.forEach(customer => {
        select.append(`
                    <option value="${customer.id}">
                        ${customer.firstname} ${customer.lastname}
                    </option>
                `);
    });
    console.log("Customers loaded:", customer_array.length);
} else {
    console.log("No customers found");
}
}

loadItems() {
    const select = $("#item-select");
    select.empty();
    select.append(`<option value="">Select Item</option>`);

    if (item_array && item_array.length) {
        item_array.forEach(item => {
            if (parseInt(item.qty) > 0) {
                select.append(`
                        <option value="${item.id}">
                            ${item.name} (Rs. ${parseFloat(item.price).toFixed(2)})
                        </option>
                    `);
            }
        });
        console.log("Items loaded:", item_array.length);
    } else {
        console.log("No items found");
    }
}

handleCustomerSelect(event) {
    const customerId = $(event.target).val();
    const customerInfo = $("#customer-info");

    if (!customerId) {
        customerInfo.hide();
        return;
    }

    const customer = customer_array.find(c => c.id === customerId);
    if (customer) {
        this.selectedCustomerId = customerId;
        $("#info-name").text(`${customer.firstname} ${customer.lastname}`);
        $("#info-email").text(customer.email);
        $("#info-phone").text(customer.phone);
        customerInfo.show();
    }
}

handleItemSelect(event) {
    const itemId = $(event.target).val();
    if (!itemId) {
        this.resetItemFields();
        return;
    }

    const item = item_array.find(i => i.id === itemId);
    if (item) {
        $("#item-price").val(`Rs. ${parseFloat(item.price).toFixed(2)}`);
        $("#item-qty").val(item.qty);
        $("#order-qty").val(1).attr('max', item.qty);
    }
}

addToCart() {
    const itemId = $("#item-select").val();
    if (!itemId) {
        this.showError("Please select an item");
        return;
    }

    const item = item_array.find(i => i.id === itemId);
    const orderQty = parseInt($("#order-qty").val());
    const stockQty = parseInt($("#item-qty").val());

    if (!this.validateOrderQty(orderQty, stockQty)) return;

    this.addItemToCart(item, orderQty);
    this.updateCartTable();
    this.resetItemFields();
    $("#item-select").val('');
}

validateOrderQty(orderQty, stockQty) {
    if (!orderQty || orderQty < 1) {
        this.showError("Please enter a valid quantity");
        return false;
    }
    if (orderQty > stockQty) {
        this.showError("Insufficient stock");
        return false;
    }
    return true;
}

addItemToCart(item, qty) {
    const existingItem = this.cartItems.find(i => i.itemId === item.id);

    if (existingItem) {
        const newQty = existingItem.qty + qty;
        if (newQty > parseInt(item.qty)) {
            this.showError("Insufficient stock");
            return;
        }
        existingItem.qty = newQty;
    } else {
        this.cartItems.push({
            itemId: item.id,
            name: item.name,
            qty: qty,
            unitPrice: parseFloat(item.price),
            total: qty * parseFloat(item.price)
        });
    }
}

updateCartTable() {
    const tbody = $("#cart-body");
    tbody.empty();

    this.cartItems.forEach((item, index) => {
        tbody.append(`
                <tr>
                    <td>${item.name}</td>
                    <td class="text-end">Rs. ${item.unitPrice.toFixed(2)}</td>
                    <td class="text-end">${item.qty}</td>
                    <td class="text-end">Rs. ${item.total.toFixed(2)}</td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm" onclick="orderController.removeFromCart(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `);
    });

    this.updateTotal();
}

removeFromCart(index) {
    this.cartItems.splice(index, 1);
    this.updateCartTable();
}

updateTotal() {
    const total = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    $("#cart-total").text(`Rs. ${total.toFixed(2)}`);
}

clearCart() {
    this.cartItems = [];
    this.updateCartTable();
}

placeOrder() {
    if (!this.validateOrder()) return;

    this.saveOrder();
    this.updateStock();
    this.resetForm();
    this.showSuccess("Order placed successfully!");

    if(orderHistoryController) {
        orderHistoryController.refreshOrderHistory();
    }

    console.log("Order placed:", order_array);
    console.log("Stock updated:", item_array);

}

validateOrder() {
    if (!this.selectedCustomerId) {
        this.showError("Please select a customer");
        return false;
    }
    if (this.cartItems.length === 0) {
        this.showError("Cart is empty");
        return false;
    }
    return true;
}

saveOrder() {
    const total = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    const order = {
        id: $("#order-id").text(),
        date: new Date(),
        customerId: this.selectedCustomerId,
        items: [...this.cartItems],
        total: total
    };
    order_array.push(order);
}

updateStock() {
    this.cartItems.forEach(cartItem => {
        const itemIndex = item_array.findIndex(i => i.id === cartItem.itemId);
        if (itemIndex !== -1) {
            item_array[itemIndex].qty -= cartItem.qty;
        }
    });
}

setOrderInfo() {
    let nextId = 1;
    if (order_array.length > 0) {
        nextId = Math.max(...order_array.map(o => parseInt(o.id.slice(1)))) + 1;
    }
    $("#order-id").text(`O${nextId}`);
    $("#order-date").text(new Date().toLocaleDateString());
}

resetForm() {
    $("#customer-select").val('');
    $("#customer-info").hide();
    this.clearCart();
    this.resetItemFields();
    this.setOrderInfo();
    this.loadItems();
}

resetItemFields() {
    $("#item-price").val('');
    $("#item-qty").val('');
    $("#order-qty").val(1);
}

showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#ff0c0c'
    });
}

showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 1500,
        showConfirmButton: false
    });
}
}

const orderController = new OrderFuntions();
window.orderController = orderController;
