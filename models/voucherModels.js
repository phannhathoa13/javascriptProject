class Voucher {
    constructor(voucherName, amount, discount, limitTime, state) {
        this.voucherName = voucherName;
        this.amount = amount
        this.discount = discount;
        this.limitTime = limitTime;
        this.state = state;
    }
}
export default Voucher