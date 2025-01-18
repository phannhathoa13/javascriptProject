class Order {
    constructor(orderID, status, totalAmount, orderDate, products) {
        this.orderID = orderID;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.products = products;
    }
}
export default Order