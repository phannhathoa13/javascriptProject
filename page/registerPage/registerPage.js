import User from '../../models/user.js';
import { validationUsername, validationPassword } from '../../validation/loginValidation.js';
import { fetchUserAPI, postUserToApi } from '../../controllers/userController.js';
import { createCartAndPushUserToCart } from '../../controllers/cartControllers.js';
import Cart from '../../models/cartModels.js';
const listUser = await fetchUserAPI();
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('pwd').value;
    const confirmPasswordInput = document.getElementById('cfpwd').value;
    const emailInput = document.getElementById('email').value;
    if (!usernameInput || !validationUsername(usernameInput) || !emailInput) {
        window.alert("your username is not wrong");
        return;
    }
    else if (!passwordInput || !validationPassword(passwordInput)) {
        window.alert("your password is wrong");
        return;
    }
    else if (!confirmPasswordInput || passwordInput != confirmPasswordInput) {
        window.alert("your password and confirm password must the same");
        return;
    }
    else if (isAccountExist(usernameInput, emailInput)) {
        window.alert("account is existed or email is existed");
        return;
    }
    else {
        const createdAt = new Date();
        const formData = new FormData(form);
        const userValue = new User(
            formData.get('username'),
            formData.get('pwd'),
            formData.get('email'),
            createdAt.toISOString(),
            "customer"
        )
        const cartValue = new Cart(
            userValue,
            createdAt.toDateString()
        )
        postUserToApi(userValue);
        createCartAndPushUserToCart(cartValue);
        this.reset();
        window.alert("register successed");
        window.location.href = "../loginPage/loginPage.html";
    }
})
document.getElementById('goLogin').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "../loginPage/loginPage.html";
})

function isAccountExist(usernameInput, emailInput) {
    return listUser.some((user) => user.username == usernameInput || user.email == emailInput);
}
