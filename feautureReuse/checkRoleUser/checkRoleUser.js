
function getValueSeasion(keyValue) {
    return sessionStorage.getItem(keyValue)
}

function removeInforUserLogedIn() {
    return sessionStorage.removeItem('role'), sessionStorage.removeItem('idUserLogedIn');
}
function checkRoleUserLogedIn(userLogedIn) {
    const roleUserLogedIn = getValueSeasion('role');
    const idUserLogedIn = getValueSeasion('idUserLogedIn');
    if (userLogedIn.user.role != roleUserLogedIn && userLogedIn.cartID != idUserLogedIn) {
        window.alert("You dont have permission to get in");
        removeInforUserLogedIn();
        window.location.href = "../../../page/userPage/loginPage/loginPage.html";
    }
    else {
        return;
    }
}

export { checkRoleUserLogedIn, removeInforUserLogedIn }