function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function postProductToParam(product) {
    const valueString = encodeURIComponent(JSON.stringify(product));
    return `?product=${valueString}`
}
function postCartIdAndProductContainer(cartID,productId, productvalue) {
    const productIDString = encodeURIComponent(JSON.stringify(productId));
    const productValueString = encodeURIComponent(JSON.stringify(productvalue));
    const cartIDString = encodeURIComponent(JSON.stringify(cartID));
    return `?cartID=${cartIDString}&productId=${productIDString}&product=${productValueString}`
}
export { getValueInParam, postCartIdAndProductContainer, postProductToParam };