
function getValueSeasion() {
    return sessionStorage.getItem('role')
}

function checkRoleUserLogedIn(userLogedIn) {
    const checkRoleUser = getValueSeasion();
    if (userLogedIn.user.role == "OWNER" || userLogedIn.user.role == "USERADMIN" && checkRoleUser != "OWNER" || checkRoleUser != "USERADMIN") {
        return;
    }
    else {
        window.alert("You dont have permission to get in");
        window.location.href = "../../page/userPage/loginPage/loginPage.html"
    }
}
export { checkRoleUserLogedIn }