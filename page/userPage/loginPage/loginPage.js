import { fetchUserAPI } from "../../../controllers/userController.js";
import { postCartIDToParam } from "../../../routes/cartRoutes.js";

const listUser = await fetchUserAPI();
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('pwd').value;
    if (isAccountHaveAdminRole(usernameInput, passwordInput)) {
        window.location.href = "../../managerPage/producctManager/productManager.html"
        return;
    }
    else if (!isAccountExisted(usernameInput, passwordInput)) {
        window.alert("wrong account");
        return;
    }
    else if (!usernameInput || !passwordInput) {
        window.alert("Please input username and password");
        return;
    }
    else {
        const getUserFormApi = getUser(usernameInput, passwordInput);
        window.alert("Login successed");
        window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(parseInt(getUserFormApi.idUser))}`;
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
function isAccountHaveAdminRole(usernameInput, passwordInput) {
    return listUser.some((user) => user.username == usernameInput && user.password == passwordInput && user.role == "ADMIN");
}