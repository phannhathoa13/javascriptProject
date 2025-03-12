import { registerCartUser } from "../../../controllers/cartControllers.js";
import { fetchListRole } from "../../../controllers/rolesControllers.js";
import { fetchUserAPI, registerAccountUser } from "../../../controllers/userController.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Cart from "../../../models/cartModels.js";
import User from "../../../models/user.js";
import { validationEmail, validationPassword, validationUsername } from "../../../validation/loginValidation.js";

const listUser = await fetchUserAPI();
const listRole = await fetchListRole();
const usernameWarning = document.getElementById('usernameWarning');
const passwordWarning = document.getElementById('passwordWarning');
const confirmPasswordWarning = document.getElementById('cfpwdWarning');
const emailWarning = document.getElementById('emailWarning');

const usernameFather = document.getElementById('username');
const passwordFather = document.getElementById('pwd');
const confirmPasswordFather = document.getElementById('cfpwd');
const emailFather = document.getElementById('email');
const registerButton = document.getElementById('register');
const codeNameInputFather = document.getElementById('codeRoleInPut');
registerButton.disabled = true;

let count = 5;

let isUsernameValid = false;
let isPasswordValid = false;
let isConfirmPasswordValid = false;
let isEmailValid = false;

hideLoading('loadingScreen');

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
    try {
        showLoading('loadingScreen');
        const codeRoleInput = codeNameInputFather.value;
        const codeName$ = getCodeRole(codeRoleInput);
        const formData = new FormData(this);
        if (codeRoleInput == "") {
            await registerAccountWithRole(formData, "CUSTOMER");
            hideLoading('loadingScreen');
            setTimeout(() => {
                window.alert("Register succeed");
                window.location.href = "../loginPage/loginPage.html";
            }, 100);
        }
        else if (!codeName$) {
            validateCountAmount(formData);
        }
        else {
            await registerAccountWithRole(formData, codeName$.role);
            hideLoading('loadingScreen');
            setTimeout(() => {
                window.alert("Register succeed");
                window.location.href = "../loginPage/loginPage.html";
            }, 100);
        }
    } catch (error) {
        console.log("register get errror", error);
    }
})


async function validateCountAmount(formData) {
    count--;
    localStorage.setItem("count", count);
    if (count >= 0) {
        if (count != 0) {
            hideLoading('loadingScreen');
            window.alert(`Your code name is wrong, you can try only ${count} time agian `);
            return;
        }
        if (count == 0) {
            await registerAccountWithRole(formData, "CUSTOMER");
            hideLoading('loadingScreen');
            setTimeout(() => {
                window.alert("Register succeed");
                window.location.href = "../loginPage/loginPage.html";
            }, 100);
        }
    }
}

async function registerAccountWithRole(formData, role) {
    const createdAt = new Date().toDateString();
    const user = new User(
        formData.get('username'),
        formData.get('pwd'),
        formData.get('email'),
        createdAt,
        role,
        "Member"
    )
    const cart = new Cart(
        user,
        createdAt
    )
    await registerAccountUser(user);
    await registerCartUser(cart);
}

function getCodeRole(codeRoleInput) {
    return listRole.find((code) => code.codeName == codeRoleInput);
}

window.goLogin = function goLogin() {
    window.location.href = "../loginPage/loginPage.html";
}
