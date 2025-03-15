
function getValueSeasion(keyValue) {
    return sessionStorage.getItem(keyValue)
}

function removeInforUserLogedIn() {
    return sessionStorage.removeItem('role'), sessionStorage.removeItem('idUserLogedIn');
}

function roleCanAccessFeature(roleRequest) {
    const roleUserLogedIn = getValueSeasion('role');
    const idUserLogedIn = getValueSeasion('idUserLogedIn');
    if (!idUserLogedIn || !roleUserLogedIn) {
        window.alert("Please login");
        window.location.href = "http://127.0.0.1:5500/page/userPage/loginPage/loginPage.html";
    }
    else if (!roleRequest.includes(roleUserLogedIn)) {
        window.alert("You dont have permission to get in");
        removeInforUserLogedIn();
        window.location.href = "http://127.0.0.1:5500/page/userPage/loginPage/loginPage.html";
    }
    else {
        return;
    }
}

export { getValueSeasion, removeInforUserLogedIn, roleCanAccessFeature }