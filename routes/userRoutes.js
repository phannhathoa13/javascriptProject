function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function postUserIDToParam(userID) {
    const valueString = encodeURIComponent(JSON.stringify(userID));
    return `?userID=${valueString}`
}
function postTwoValueToParam(value, newValue) {
    const valueString = encodeURIComponent(JSON.stringify(value));
    const newValueString = encodeURIComponent(JSON.stringify(newValue));
    return `?value=${valueString}&newValue=${newValueString}`;
}
export { getValueInParam, postTwoValueToParam, postUserIDToParam };