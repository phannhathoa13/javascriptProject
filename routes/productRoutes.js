function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function pushUserIDAndProductToViewCart(userID, products) {
    const valueString = encodeURIComponent(JSON.stringify(userID));
    const products = encodeURIComponent(JSON.stringify(products));
    window.location.href = `../../hell-project/page/viewCart/viewCart.html?&userID=${valueString}&products=${products}`
}
export { getValueInParam, pushUserIDAndProductToViewCart };