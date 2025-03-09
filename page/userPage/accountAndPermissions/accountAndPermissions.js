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
const userAccountInfor = userLogedIn.user;

displayAccount()

function displayAccount() {
    showLoading('loadingScreen');

    const accountInforContainerDOM = document.getElementById('accountInforContainer');
    accountInforContainerDOM.style.fontSize = "18px";
    accountInforContainerDOM.style.marginTop = "10px";

    const roleDOM = document.getElementById('role');
    roleDOM.innerHTML = userAccountInfor.role;

    usernameDOM.innerHTML = userAccountInfor.username;

    passwordDOM.style.cursor = "pointer";
    passwordDOM.innerHTML = "*****";
    passwordDOM.onclick = () => {
        displayPassword(passwordDOM, userAccountInfor.password);
    }

    emailDOM.innerHTML = userAccountInfor.email;

    const createdAtDOM = document.getElementById('createdAt');
    createdAtDOM.innerHTML = userAccountInfor.createdAt;

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
    passwordInputDOM.value = userAccountInfor.password;
    confirmPasswordInputDOM.value = userAccountInfor.password;
    emailInputDOM.value = userAccountInfor.email;
}

window.save = async function save() {
    showLoading('loadingScreen');
    const userInfor = new User(
        userAccountInfor.username,
        passwordInputDOM.value,
        emailInputDOM.value,
        userAccountInfor.createdAt,
        userAccountInfor.role,
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
    const inputValue = event.target.value;

    if (targetDOM == passwordInputDOM) {
        validatePassword(inputValue);
        console.log(isPasswordValid, "password");
        
    }
    if (targetDOM == confirmPasswordInputDOM) {
        validateConfirmPassword(inputValue, passwordInputValue);
        console.log(isConfirmPasswordValid, "confirm password");
    }
    if (targetDOM == emailInputDOM) {
        validateEmail(inputValue);
        console.log(isEmailValid, "email");
    }
}

function validatePassword(inputValue) {
    if (!inputValue) {
        errorMassage(passwordInputDOM, passwordWarningDOM);
        passwordWarningDOM.innerHTML = "Your password is empty";
        isPasswordValid = false;
    }
    else if (!validationPassword(inputValue)) {
        errorMassage(passwordInputDOM, passwordWarningDOM);
        passwordWarningDOM.innerHTML = "Your password must have 1 special character, 1 uppercase letter and must longer then 8 character";
        isPasswordValid = false;
    }
    else {
        passwordWarningDOM.innerHTML = "";
        passwordInputDOM.style.border = "1px solid black";
        isPasswordValid = true;
        isAccountInforVaild();
    }
}

function validateConfirmPassword(inputValue, passwordInputValue) {
    if (!inputValue) {
        errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
        confirmPasswordWarningDOM.innerHTML = "Your confirm password is empty";
        isConfirmPasswordValid = false;
    }
    else if (inputValue != passwordInputValue) {
        errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
        confirmPasswordWarningDOM.innerHTML = "Your password and confirm password must the same";
        isConfirmPasswordValid = false;
    }
    else {
        confirmPasswordWarningDOM.innerHTML = "";
        confirmPasswordInputDOM.style.border = "1px solid black";
        isConfirmPasswordValid = true;
        isAccountInforVaild();
    }
}


function validateEmail(inputValue) {
    if (!inputValue) {
        errorMassage(emailInputDOM, emailWarning);
        emailWarningDOM.innerHTML = "Your email is empty";
        isEmailValid = false;
    }
    else if (!validationEmail(inputValue)) {
        errorMassage(emailInputDOM, emailWarningDOM);
        emailWarningDOM.innerHTML = "Your email is not valid";
        isEmailValid = false;
    }
    else if (isEmailExisted(inputValue)) {
        errorMassage(emailInputDOM, emailWarningDOM);
        emailWarningDOM.innerHTML = "Your email is existed !, please try new one ";
        isEmailValid = false;
    }
    else {
        emailWarningDOM.innerHTML = "";
        emailInputDOM.style.border = "1px solid black";
        isEmailValid = true;
        isAccountInforVaild();
    }
}

function isAccountInforVaild() {
    if (isPasswordValid && isConfirmPasswordValid && isEmailValid) {
        buttonSaveDOM.disabled = false;
    }
    else if (!isPasswordValid || !isConfirmPasswordValid || !isEmailValid) {
        buttonSaveDOM.disabled = true;
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