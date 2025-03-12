function voucherNameRegex(voucherNameInput) {
    return /^[A-Z]{8}$/g.test(voucherNameInput);
}
export { voucherNameRegex }