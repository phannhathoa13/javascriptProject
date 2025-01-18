class Cart {
    constructor(user, createdAt) {
        this.user = user;
        this.products = [];
        this.totalPrice = 0;
        this.createdAt = createdAt;
    }
}
export default Cart