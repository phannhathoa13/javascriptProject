function getValueInQuerryParam(string) {
    const param = getValueInParam();
    const getUserIDInParam = JSON.parse(decodeURIComponent(param.get(string)));
    return getUserIDInParam;
}
function postCartIdAndOrderIDToParam(cartID, orderID) {
    const cartIDString = encodeURIComponent(JSON.stringify(cartID));
    const orderIDString = encodeURIComponent(JSON.stringify(orderID));
    return `?cartID=${cartIDString}&orderID=${orderIDString}`;
}
export { getValueInQuerryParam , postCartIdAndOrderIDToParam };
