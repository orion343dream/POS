import { customer_array } from "../../db/database.js";
import CustomerModel from "../models/CustomerModel.js";
import { item_array } from "../../db/database.js";
import ItemModel from "../models/ItemModel.js";
import { customer_array } from "../../db/database.js";
import { item_array } from "../../db/database.js";
import { order_array } from "../../db/database.js";

function updateDashboardinfos() {
    // Calculate Total Sales
    const totalSales = order_array.reduce((total, order) => {
        return total + order.total;
    }, 0);
    $("#total-sales").text(`Rs. ${totalSales.toFixed(2)}`);

    // Calculate Total Orders
    const totalOrders = order_array.length;
    $("#total-orders").text(totalOrders);

    // Calculate Total Customers
    const totalCustomers = customer_array.length;
    $("#total-customers").text(totalCustomers);

    // Calculate Total Items
    const totalItems = item_array.length;
    $("#total-items").text(totalItems);

    // Update Recent Orders
    updateRecentOrders();

    // Update Top Selling Items
    updateTopSellingItems();
}

function updateRecentOrders() {
    const recentOrdersList = $("#recent-orders-list");
    recentOrdersList.empty();

    // Sort orders by date in descending order and take top 3
    const sortedOrders = order_array
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    sortedOrders.forEach(order => {
        recentOrdersList.append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Order #${order.id}
                <span class="badge bg-primary rounded-pill">Rs. ${order.total.toFixed(2)}</span>
            </li>
        `);
    });
}

function updateTopSellingItems() {
    const topSellingItemsList = $("#top-selling-items-list");
    topSellingItemsList.empty();

    // Calculate item sales
    const itemSales = {};
    order_array.forEach(order => {
        order.items.forEach(item => {
            if (!itemSales[item.name]) {
                itemSales[item.name] = 0;
            }
            itemSales[item.name] += item.qty;
        });
    });

    // Sort items by sales in descending order and take top 3
    const topItems = Object.entries(itemSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    topItems.forEach(([itemName, qty]) => {
        topSellingItemsList.append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${itemName}
                <span class="badge bg-success rounded-pill">${qty} sold</span>
            </li>
        `);
    });
}

// Call this function whenever an order is placed or data changes
$(document).ready(function() {
    updateDashboardinfos();
});

// Expose the function globally in case you want to call it manually
window.updateDashboardinfos = updateDashboardinfos;