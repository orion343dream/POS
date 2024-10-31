import { order_array } from "../db/database.js";

class OrderHistoryController {
    constructor() {
        this.initialize();
    }

    initialize() {
        console.log("Order History Controller Initialized");
        this.loadOrderHistory();
    }

    loadOrderHistory() {
        const tableBody = $("#tbl-order-history");
        tableBody.empty();

        console.log("Orders array:", order_array); // Debug log

        if (!order_array || order_array.length === 0) {
            tableBody.append(`
        <tr>
        <td colspan="5" class="text-center">No orders</td>
        </tr>
        `);
            return;
        }

        order_array.forEach(order => {
            tableBody.append(`
        <tr>
        <td>${order.id}</td>
        <td>${order.customerId}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>Rs. ${order.total.toFixed(2)}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="orderHistoryController.viewOrderDetail('${order.id}')">
                View
            </button>
        </td>
        </tr>
            `);
        });
    }

    viewOrderDetail(orderId) {
        const order = order_array.find(o => o.id === orderId);
        if(!order) return;

        Swal.fire({
            title: `Order Details - ${order.id}`,
            html: `
        <table class="table">
            <thead>
            <tr>
            <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
        </tr>
        </thead>
        <tbody>
        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.qty}</td>
                                <td>Rs. ${item.unitPrice}</td>
                                <td>Rs. ${item.total}</td>
                            </tr>
                        `).join('')}
        </tbody>
        <tfoot>
        <tr>
            <th colspan="3" class="text-end">Total:</th>
            <td>Rs. ${order.total}</td>
        </tr>
        </tfoot>
        </table>
        `
        });
    }

    refreshOrderHistory() {
        this.loadOrderHistory();
    }
}


const orderHistoryController = new OrderHistoryController();

window.orderHistoryController = orderHistoryController;
export { orderHistoryController };