function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function postProductToParam(product) {
    const valueString = encodeURIComponent(JSON.stringify(product));
    return `?product=${valueString}`
}
function postProductIdToParam(productID) {
    const valueString = encodeURIComponent(JSON.stringify(productID));
    return `?productID=${valueString}`
}
function postCartIDAndProductIDToParam(cartID, productId) {
    const productIDString = encodeURIComponent(JSON.stringify(productId));
    const cartIDString = encodeURIComponent(JSON.stringify(cartID));
    return `?cartID=${cartIDString}&productId=${productIDString}`
}
export { getValueInParam, postCartIDAndProductIDToParam, postProductToParam, postProductIdToParam };