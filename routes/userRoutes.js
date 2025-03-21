function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}
function postUserIDToParam(userID) {
    const valueString = encodeURIComponent(JSON.stringify(userID));
    return `?userID=${valueString}`
}

function postRoleRequestId(roleRequestId) {
    const valueString = encodeURIComponent(JSON.stringify(roleRequestId));
    return `?roleRequestId=${valueString}`
}


function getUserIdFromParam(string) {
    const param = getValueInParam();
    const getUserIDInParam = JSON.parse(decodeURIComponent(param.get(string)));
    return getUserIDInParam;
}


function postTwoValueToParam(value, newValue) {
    const valueString = encodeURIComponent(JSON.stringify(value));
    const newValueString = encodeURIComponent(JSON.stringify(newValue));
    return `?value=${valueString}&newValue=${newValueString}`;
}
export { getValueInParam, postTwoValueToParam, postRoleRequestId, postUserIDToParam, getUserIdFromParam };