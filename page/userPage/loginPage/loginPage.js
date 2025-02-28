import { fetchUserAPI } from "../../../controllers/userController.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import { postCartIDToParam } from "../../../routes/cartRoutes.js";

const listUser = await fetchUserAPI();
hideLoading('loadingScreen');

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    showLoading("loadingScreen");
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('pwd').value;

    const getUserFormApi = getUser(usernameInput, passwordInput);

    if (!usernameInput || !passwordInput) {
        hideLoading('loadingScreen');

        setTimeout(() => {
            window.alert("Please input your username and password");
            return;
        }, 100);

    }
    else if (!isAccountExisted(usernameInput, passwordInput)) {
        hideLoading('loadingScreen');

        setTimeout(() => {
            window.alert("wrong account");
            return;
        }, 100);
    }
    else if (isAccountHaveRoleUserAdmin(usernameInput, passwordInput) || isAccountHaveRoleOwner(usernameInput, passwordInput)) {
        hideLoading('loadingScreen');

        setTimeout(() => {
            window.alert("Login successed");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(parseInt(getUserFormApi.idUser))}`;
            return;
        }, 100);
    }
    else {
        hideLoading('loadingScreen');

        setTimeout(() => {
            window.alert("Login successed");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(parseInt(getUserFormApi.idUser))}`;
            return;
        }, 100);
    }
})
window.negativeToRegiser = function negativeToRegiser() {
    window.location.href = "../registerPage/registerPage.html";
}
function getUser(usernameInput, passwordInput) {
    return listUser.find((user) => user.username == usernameInput && user.password == passwordInput);
}

function isAccountExisted(usernameInput, passwordInput) {
    return listUser.some((user) => user.username == usernameInput && user.password == passwordInput);
}
function isAccountHaveRoleUserAdmin(usernameInput, passwordInput) {
    return listUser.some((user) => user.username == usernameInput && user.password == passwordInput && user.role == "USERADMIN");
}

function isAccountHaveRoleOwner(usernameInput, passwordInput) {
    return listUser.some((user) => user.username == usernameInput && user.password == passwordInput && user.role == "OWNER");
}