function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function postProductToParam(product) {
    const valueString = encodeURIComponent(JSON.stringify(product));
    return `?product=${valueString}`
}
function postProductIdAndValueToParam(productId, productvalue) {
    const productIDString = encodeURIComponent(JSON.stringify(productId));
    const productValueString = encodeURIComponent(JSON.stringify(productvalue));
    return `?productId=${productIDString}&product=${productValueString}`
}
export { getValueInParam, postProductIdAndValueToParam, postProductToParam };