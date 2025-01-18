
function postCartIDToParam(cartID) {
    const valueString = encodeURIComponent(JSON.stringify(cartID));
    return `?cartID=${valueString}`
}
function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function getValueInQuerryParam(string) {
    const param = getValueInParam();
    const getUserIDInParam = JSON.parse(decodeURIComponent(param.get(string)));
    return getUserIDInParam;
}
function postCartIdAndValueToParam(cartID, cartValue) {
    const valueString = encodeURIComponent(JSON.stringify(cartID));
    const cartValueString = encodeURIComponent(JSON.stringify(cartValue));
    return `?cartID=${valueString}&product=${cartValueString}`
}
export { postCartIDToParam, getValueInQuerryParam, postCartIdAndValueToParam }