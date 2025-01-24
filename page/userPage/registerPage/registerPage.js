import { registerCartUser } from "../../../controllers/cartControllers.js";
import { fetchUserAPI, registerAccountUser } from "../../../controllers/userController.js";
import Cart from "../../../models/cartModels.js";
import User from "../../../models/user.js";
import { validationEmail, validationPassword, validationUsername } from "../../../validation/loginValidation.js";

const listUser = await fetchUserAPI();

const usernameWarning = document.getElementById('usernameWarning');
const passwordWarning = document.getElementById('passwordWarning');
const confirmPasswordWarning = document.getElementById('cfpwdWarning');
const emailWarning = document.getElementById('emailWarning');

const usernameFather = document.getElementById('username');
const passwordFather = document.getElementById('pwd');
const confirmPasswordFather = document.getElementById('cfpwd');
const emailFather = document.getElementById('email');


document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const usernameInput = usernameFather.value;
    const passwordInput = passwordFather.value;
    const confirmPassword = confirmPasswordFather.value;
    const emailInput = emailFather.value;
    const formData = new FormData(this);


    if (!usernameInput) {
        usernameFather.style.border = "1px solid rgb(205, 82, 82)";
        usernameWarning.innerHTML = "Your username is empty !";
        return;
    }
    else if (!validationUsername(usernameInput)) {
        usernameFather.style.border = "1px solid rgb(205, 82, 82)";
        usernameWarning.innerHTML = "Your username is not valid !";
        return;
    }
    else if (isUsernameExisted(usernameInput)) {
        usernameFather.style.border = "1px solid rgb(205, 82, 82)";
        usernameWarning.innerHTML = "Your username is existed !";
        return;
    }
    else if (!passwordInput) {
        passwordFather.style.border = "1px solid rgb(205, 82, 82)";
        passwordWarning.innerHTML = "Your password is empty !";
        return;
    }
    else if (!confirmPassword) {
        confirmPasswordFather.style.border = "1px solid rgb(205, 82, 82)";
        confirmPasswordWarning.innerHTML = "Your confirm password is empty !";
        return;
    }
    else if (!validationPassword(passwordInput)) {
        passwordFather.style.border = "1px solid rgb(205, 82, 82)";
        if (passwordInput.length < 8) {
            passwordWarning.innerHTML = "Your password must over 8 character";
        }
        else if (passwordInput.toLowerCase()) {
            passwordWarning.innerHTML = "Your password must have 1 sentisive character";
        }
        else if (!passwordInput.includes("!@#$%^&")) {
            passwordWarning.innerHTML = "Your password must have 1 special character";
        }
        return;
    }
    else if (passwordInput != confirmPassword) {
        passwordFather.style.border = "1px solid rgb(205, 82, 82)";
        confirmPasswordWarning.innerHTML = "Your password or confirm password is not the same !";
        return;
    }
    else if (!emailInput) {
        emailFather.style.border = "1px solid rgb(205, 82, 82)";
        emailWarning.innerHTML = "Your email is empty !";
        return;
    }
    else if (!validationEmail(emailInput)) {
        emailFather.style.border = "1px solid rgb(205, 82, 82)";
        if (!emailInput.includes("@")) {
            emailWarning.innerHTML = "Your email must have @";
        }
        return;
    }
    else if (isEmailExisted(emailInput)) {
        emailFather.style.border = "1px solid rgb(205, 82, 82)";
        emailWarning.innerHTML = "Your email is existed";
        return;
    }
    else {
        registerAccount(formData);
        window.alert("register susceed");
        window.location.href = "../loginPage/loginPage.html";
    }
})

function registerAccount(formData) {
    const createdAt = new Date().toDateString();
    const user = new User(
        formData.get('username'),
        formData.get('pwd'),
        formData.get('email'),
        createdAt,
        "CUSTOMER"
    )
    const cart = new Cart(
        user,
        createdAt
    )
    registerAccountUser(user);
    registerCartUser(cart);
}

function isUsernameExisted(usernameInput) {
    return listUser.some((user) => user.username == usernameInput);
}

function isEmailExisted(emailInput) {
    return listUser.some((user) => user.email == emailInput);

}