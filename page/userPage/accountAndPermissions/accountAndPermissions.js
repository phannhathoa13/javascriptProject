import { fetchCartFromUserLogedIn, updateCart$ } from "../../../controllers/cartControllers.js";
import { editAccount$, fetchUserAPI } from "../../../controllers/userController.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import User from "../../../models/user.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";
import { validationEmail, validationPassword } from "../../../validation/loginValidation.js";

const listUser = await fetchUserAPI();
const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

const usernameDOM = document.getElementById('username');
const passwordDOM = document.getElementById('password');
const confirmPasswordDOM = document.getElementById('confirmPassword');
const emailDOM = document.getElementById('email');

const passwordInputDOM = document.getElementById('passwordInput');

const confirmPasswordInputDOM = document.getElementById('confirmPasswordInput');

const emailInputDOM = document.getElementById('emailInput');

const passwordWarningDOM = document.getElementById('passwordWarning');
const confirmPasswordWarningDOM = document.getElementById('confirmPasswordWarning');
const emailWarningDOM = document.getElementById('emailWarning');

const buttonSaveDOM = document.getElementById('buttonSave');
buttonSaveDOM.disabled = true;


let isPasswordValid = false;
let isConfirmPasswordValid = false;
let isEmailValid = false;

console.log(userLogedIn);
const accountInfor = userLogedIn.user;

displayAccount()

function displayAccount() {
    showLoading('loadingScreen');

    const accountInforContainerDOM = document.getElementById('accountInforContainer');
    accountInforContainerDOM.style.fontSize = "18px";
    accountInforContainerDOM.style.marginTop = "10px";

    const roleDOM = document.getElementById('role');
    roleDOM.innerHTML = accountInfor.role;

    usernameDOM.innerHTML = accountInfor.username;

    passwordDOM.style.cursor = "pointer";
    passwordDOM.innerHTML = "*****";
    passwordDOM.onclick = () => {
        displayPassword(passwordDOM, accountInfor.password);
    }

    emailDOM.innerHTML = accountInfor.email;

    const createdAtDOM = document.getElementById('createdAt');
    createdAtDOM.innerHTML = accountInfor.createdAt;

    displayInputAndInforDOM("none", "inline-block");
    hideLoading('loadingScreen');

}

function displayInputAndInforDOM(string, inforDOMDisplay) {

    passwordInputDOM.style.display = string;
    confirmPasswordDOM.style.display = string;
    emailInputDOM.style.display = string;
    buttonSaveDOM.style.display = string;

    passwordDOM.style.display = inforDOMDisplay;
    emailDOM.style.display = inforDOMDisplay;
}

function displayPassword(passwordDOM, accountPassword) {
    if (passwordDOM.innerHTML == "*****") {
        passwordDOM.innerHTML = accountPassword
    }
    else {
        passwordDOM.innerHTML = "*****";
    }
}

window.editAccount = function editAccount() {
    displayInputAndInforDOM("inline-block", "none");
    passwordInputDOM.value = accountInfor.password;
    confirmPasswordInputDOM.value = accountInfor.password;
    emailInputDOM.value = accountInfor.email;

    const passwordInputValue = passwordInputDOM.value;
    const emailInputValue = emailInputDOM.value;

    buttonSaveDOM.disabled = false;
}

window.save = async function save() {
    showLoading('loadingScreen');
    const userInfor = new User(
        accountInfor.username,
        passwordInputDOM.value,
        emailInputDOM.value,
        accountInfor.createdAt,
        accountInfor.role,
    )
    const updateUser = editAccount$(userLogedIn.cartID, userInfor);
    const updatedCart = updateCart$(userLogedIn.cartID, userInfor, userLogedIn);
    await Promise.all([updateUser, updatedCart]);
    hideLoading('loadingScreen');
    setTimeout(() => {
        window.alert("Account information updated successfully!");
        location.reload();
    }, 200);

}


window.validateInput = function validateInput(event) {
    const passwordInputValue = passwordInputDOM.value;
    const confirmPasswordInputValue = confirmPasswordInputDOM.value;

    const targetDOM = event.target;
    const userInforInput = event.target.value;

    if (targetDOM == passwordInputDOM) {
        validatePassword(passwordWarningDOM, userInforInput);
        if (passwordInputValue != confirmPasswordInputValue) {
            errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
            confirmPasswordWarningDOM.innerHTML = "Your password and confirm password must the same";
            isPasswordValid = false;
            return;
        }
        else {
            confirmPasswordWarningDOM.innerHTML = "";
            confirmPasswordInputDOM.style.border = "1px solid black";
            isPasswordValid = true;
            return;
        }
    }
    if (targetDOM == confirmPasswordInputDOM) {
        validateConfirmPassword(userInforInput, passwordInputValue, confirmPasswordWarningDOM);
    }
    if (targetDOM == emailInputDOM) {
        validateEmail(userInforInput, emailWarningDOM);
    }
}

function validatePassword(passwordWarningDOM, userInforInput) {
    if (!userInforInput) {
        errorMassage(passwordInputDOM, passwordWarningDOM);
        passwordWarningDOM.innerHTML = "Your password is empty";
        return;
    }
    else if (!validationPassword(userInforInput)) {
        errorMassage(passwordInputDOM, passwordWarningDOM);
        passwordWarningDOM.innerHTML = "Your password must have 1 special character, 1 uppercase letter and must longer then 8 character";
        return;
    }
    else {
        passwordWarningDOM.innerHTML = "";
        passwordInputDOM.style.border = "1px solid black";
        isPasswordValid = true;
        isAccountInforVaild();
        return;
    }
}

function validateConfirmPassword(userInforInput, passwordInputValue, confirmPasswordWarningDOM) {
    if (!userInforInput) {
        errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
        confirmPasswordWarningDOM.innerHTML = "Your confirm password is empty";
        return;
    }
    else if (userInforInput != passwordInputValue) {
        errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
        confirmPasswordWarningDOM.innerHTML = "Your password and confirm password must the same";
        return;
    }
    else {
        confirmPasswordWarningDOM.innerHTML = "";
        confirmPasswordInputDOM.style.border = "1px solid black";
        isConfirmPasswordValid = true;
        isAccountInforVaild();
        return
    }
}


function validateEmail(userInforInput, emailWarningDOM) {
    if (!userInforInput) {
        errorMassage(emailInputDOM, emailWarning);
        emailWarningDOM.innerHTML = "Your email is empty";
        return;
    }
    else if (!validationEmail(userInforInput)) {
        errorMassage(emailInputDOM, emailWarningDOM);
        emailWarningDOM.innerHTML = "Your email is not valid";
        return;
    }
    else if (isEmailExisted(userInforInput)) {
        errorMassage(emailInputDOM, emailWarningDOM);
        emailWarningDOM.innerHTML = "Your email is existed !, please try new one ";
        return;
    }
    else {
        emailWarningDOM.innerHTML = "";
        emailInputDOM.style.border = "1px solid black";
        isEmailValid = true;
        isAccountInforVaild();
        return;
    }
}

function isAccountInforVaild() {
    if (isPasswordValid && isConfirmPasswordValid && isEmailValid) {
        buttonSaveDOM.disabled = false;
    }
}

function isEmailExisted(emailInput) {
    return listUser.some((user) => user.email == emailInput);
}

function errorMassage(valueInput, textWarning) {
    valueInput.style.border = "3px solid rgb(205, 82, 82)";
    textWarning.style.color = "red";
}

window.back = function back() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`
}