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
const registerButton = document.getElementById('register');
registerButton.disabled = true;

let isUsernameValid = false;
let isPasswordValid = false;
let isConfirmPasswordValid = false;
let isEmailValid = false;

function isUsernameExisted(usernameInput) {
    return listUser.some((user) => user.username == usernameInput);
}

function isEmailExisted(emailInput) {
    return listUser.some((user) => user.email == emailInput);
}

window.validateUsername = function validateUsername(event) {
    const usernameInput = event.target.value;
    if (!usernameInput) {
        errorMassage(usernameFather, usernameWarning);
        usernameWarning.innerHTML = "Your username is empty !";
        return;
    }
    else if (!validationUsername(usernameInput)) {
        errorMassage(usernameFather, usernameWarning);
        usernameWarning.innerHTML = "Your username is not valid !";
        return;
    }
    else if (isUsernameExisted(usernameInput)) {
        errorMassage(usernameFather, usernameWarning);
        usernameWarning.innerHTML = "Your username is existed !, please try new one";
        return;
    }
    else {
        usernameWarning.innerHTML = "";
        usernameFather.style.border = "1px solid black";
        isUsernameValid = true;
        updateButtonRegister();
        return;
    }
}

window.validatePassword = function validatePassword(event) {
    const passwordInput = event.target.value;
    if (!passwordInput) {
        errorMassage(passwordFather, passwordWarning);
        passwordWarning.innerHTML = "Your password is empty !";
        return;
    }
    else if (!validationPassword(passwordInput)) {
        errorMassage(passwordFather, passwordWarning);
        passwordWarning.innerHTML = "Your password must have 1 special character, 1 uppercase letter and must longer then 8 character";
        return;
    }
    else {
        passwordWarning.innerHTML = "";
        passwordFather.style.border = "1px solid black";
        isPasswordValid = true;
        updateButtonRegister();
        return;
    }
}

window.validateConfirmPassword = function validateConfirmPassword(event) {
    const confirmPasswordInput = event.target.value;
    const passwordInputValue = passwordFather.value;
    if (!confirmPasswordInput) {
        errorMassage(confirmPasswordFather, confirmPasswordWarning);
        confirmPasswordWarning.innerHTML = "Your confirm password is empty";
        return;
    }
    else if (confirmPasswordInput != passwordInputValue) {
        errorMassage(confirmPasswordFather, confirmPasswordWarning);
        confirmPasswordWarning.innerHTML = "Your password and confirm password must the same";
        return;
    }
    else {
        confirmPasswordWarning.innerHTML = "";
        confirmPasswordFather.style.border = "1px solid black";
        isConfirmPasswordValid = true;
        updateButtonRegister();
        return
    }
}

window.validateEmail = function validateEmail(event) {
    const emailInput = event.target.value;
    if (!emailInput) {
        errorMassage(emailFather, emailWarning);
        emailWarning.innerHTML = "Your email is empty";
        return;
    }
    else if (!validationEmail(emailInput)) {
        errorMassage(emailFather, emailWarning);
        emailWarning.innerHTML = "Your email is not valid ";
        return;
    }
    else if (isEmailExisted(emailInput)) {
        errorMassage(emailFather, emailWarning);
        emailWarning.innerHTML = "Your email is existed !, please try new one ";
    }
    else {
        emailWarning.innerHTML = "";
        emailFather.style.border = "1px solid black";
        isEmailValid = true;
        updateButtonRegister();
        return;
    }
}

function errorMassage(valueInput, textWarning) {
    valueInput.style.border = "1px solid rgb(205, 82, 82)";
    textWarning.style.color = "red";
}

function updateButtonRegister() {
    if (isUsernameValid && isPasswordValid && isConfirmPasswordValid && isEmailValid) {
        registerButton.disabled = false;
    }
}
document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    await registerAccount(formData);
    window.alert("register susceed");
    window.location.href = "../loginPage/loginPage.html";

})

async function registerAccount(formData) {
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
    await registerAccountUser(user);
    await registerCartUser(cart);
}

window.goLogin = function goLogin() {
    window.location.href = "../loginPage/loginPage.html";
}
