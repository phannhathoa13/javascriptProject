class Order {
    constructor(user, cartList, totalPrice, status, createdAt,orderID) {
        this.user = user;
        this.cartList = cartList;
        this.totalPrice = totalPrice
        this.status = status;
        this.createdAt = createdAt;
        this.orderID = orderID;
    }
}
export default Order