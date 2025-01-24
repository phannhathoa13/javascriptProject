class Order {
    constructor(user, cartList, totalPrice, status, createdAt) {
        this.user = user;
        this.cartList = cartList;
        this.totalPrice = totalPrice
        this.status = status;
        this.createdAt = createdAt;
    }
}
export default Order