function voucherNameRegex(voucherNameInput) {
    return /^[A-Z]{1,8}$/g.test(voucherNameInput);
}
export { voucherNameRegex }