import {
  fetchCartFromUserLogedIn,
  updateCart$,
} from "../../../controllers/cartControllers.js";
import {
  fetchListRequestRole$,
  requestRole$,
} from "../../../controllers/rolesControllers.js";
import {
  editAccount$,
  fetchUserAPI,
} from "../../../controllers/userController.js";
import { getValueSeasion, roleCanAccessFeature } from "../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import {
  hideLoading,
  showLoading,
} from "../../../feautureReuse/loadingScreen.js";
import User from "../../../models/user.js";
import {
  validationEmail,
  validationPassword,
} from "../../../validation/loginValidation.js";

const listUser = await fetchUserAPI();
const listRoleReuquested = await fetchListRequestRole$();

const getUserId = getValueSeasion('idUserLogedIn');

let userLogedIn = await fetchCartFromUserLogedIn(getUserId);

const passwordDOM = document.getElementById("password");
const confirmPasswordDOM = document.getElementById("confirmPassword");
const emailDOM = document.getElementById("email");

const passwordInputDOM = document.getElementById("passwordInput");
const confirmPasswordInputDOM = document.getElementById("confirmPasswordInput");
const emailInputDOM = document.getElementById("emailInput");
const requestRoleButtonDOM = document.getElementById("requestRole");
// const socket = new WebSocket("ws://localhost:3000");

const listRoles = ["CUSTOMER", "USERADMIN", "OWNER"];

// socket.onopen = () => {
//   console.log("✅ Kết nối WebSocket thành công");
// };

// socket.onmessage = (event) => {
//   console.log(event);

//   const notification = JSON.parse(event.data);
//   console.log("🔔 Nhận thông báo:", notification);
// };

// socket.onclose = () => {
//   console.log("❌ WebSocket bị đóng!");
// };

// window.sendNotification = function sendNotification() {
//   const test = {
//     type: "cussess",
//     message: "test",
//   };
//   socket.send(JSON.stringify(test));
// };

let isPasswordValid = false;
let isConfirmPasswordValid = false;
let isEmailValid = false;

const userAccountInfor = userLogedIn.user;
const userLogedInInformation = getUserID(userAccountInfor.username);
roleCanAccessFeature(["CUSTOMER", "USERADMIN", "OWNER"]);

displayAccount();
checkRequestRole();

function displayAccount() {
  showLoading("loadingScreenDOM");
  const personDenied = getPersonDeniedRequest("personDeny");
  const idUserDenied = getPersonDeniedRequest("idUserDenied");

  if (userLogedInInformation.idUser == idUserDenied) {
    window.alert(
      `Your request role have been denined by user: ${personDenied}`
    );
    hideLoading("loadingScreenDOM");
    sessionStorage.removeItem("personDeny");
    sessionStorage.removeItem("idUserDenied");
  }
  const usernameDOM = document.getElementById("username");

  const accountInforContainerDOM = document.getElementById(
    "accountInforContainer"
  );
  accountInforContainerDOM.style.fontSize = "18px";
  accountInforContainerDOM.style.marginTop = "10px";

  const roleDOM = document.getElementById("role");
  roleDOM.style.color = "rgb(218 28 28)";
  roleDOM.innerHTML = userAccountInfor.role;

  usernameDOM.innerHTML = userAccountInfor.username;

  passwordDOM.style.cursor = "pointer";
  passwordDOM.innerHTML = "*****";
  passwordDOM.onclick = () => {
    displayPassword(passwordDOM, userAccountInfor.password);
  };

  emailDOM.innerHTML = userAccountInfor.email;

  const createdAtDOM = document.getElementById("createdAt");
  createdAtDOM.innerHTML = userAccountInfor.createdAt;

  const rankingDOM = document.getElementById("ranking");
  rankingDOM.innerHTML = `${userAccountInfor.ranking}`;
  rankingDOM.style.color = "rgb(246 143 0)";

  displayInputAndInforDOM("none", "inline-block");
  hideLoading("loadingScreenDOM");
}

window.requestRole = async function requestRole() {
  showLoading("loadingScreenDOM");
  const roleCustomer = getRole("CUSTOMER");
  const roleAdmin = getRole("USERADMIN");
  const roleOwner = getRole("OWNER");

  if (userLogedInInformation.role == roleCustomer) {
    await requestRole$(userLogedInInformation, roleAdmin);
    hideLoading("loadingScreenDOM");
    setTimeout(() => {
      window.alert("Request for permission has been sent");
      location.reload();
    }, 100);
  }
  if (userLogedInInformation.role == roleAdmin) {
    await requestRole$(userLogedInInformation, roleOwner);
    hideLoading("loadingScreenDOM");
    setTimeout(() => {
      window.alert("Request for permission has been sent");
      location.reload();
    }, 100);
  }
  if (userLogedInInformation.role == roleOwner) {
    hideLoading("loadingScreenDOM");
    window.alert("You are OWNER can't request more");
    return;
  }
};

function getRole(roleName) {
  return listRoles.find((roles) => roles == roleName);
}

function checkRequestRole() {
  if (isRequestApproved()) {
    requestRoleButtonDOM.textContent = `Approved Role: ${userLogedInInformation.role}`;
    requestRoleButtonDOM.style.background = "#8dff8d";
    requestRoleButtonDOM.style.border = "1px solid #53a45a";
    requestRoleButtonDOM.style.color = "#000000";
    requestRoleButtonDOM.disabled = true;
  } else if (isUserRequestedRole(userLogedInInformation.idUser)) {
    requestRoleButtonDOM.textContent = "Pending";
    requestRoleButtonDOM.style.background = "#eaea00";
    requestRoleButtonDOM.style.border = "1px solid #53a45a";
    requestRoleButtonDOM.style.color = "#000000";
    requestRoleButtonDOM.onclick = () => {
      window.alert("You have requested permission.");
      return;
    };
  }
}

function displayInputAndInforDOM(string, inforDOMDisplay) {
  const buttonSaveDOM = document.getElementById("buttonSave");
  passwordInputDOM.style.display = string;
  confirmPasswordDOM.style.display = string;
  emailInputDOM.style.display = string;
  buttonSaveDOM.style.display = string;

  passwordDOM.style.display = inforDOMDisplay;
  emailDOM.style.display = inforDOMDisplay;
}

function displayPassword(passwordDOM, accountPassword) {
  if (passwordDOM.innerHTML == "*****") {
    passwordDOM.innerHTML = accountPassword;
  } else {
    passwordDOM.innerHTML = "*****";
  }
}

window.editAccount = function editAccount() {
  displayInputAndInforDOM("inline-block", "none");
  passwordInputDOM.value = userAccountInfor.password;
  confirmPasswordInputDOM.value = userAccountInfor.password;
  emailInputDOM.value = userAccountInfor.email;
  document.getElementById("editAcccountButton").style.display = "none";
  requestRoleButtonDOM.style.display = "none";
};

window.save = async function save() {
  showLoading("loadingScreenDOM");
  if (!validatePassword(passwordInputDOM.value)) {
    !isAccountInforVaild();
    hideLoading("loadingScreenDOM");
  }
  if (
    !validateConfirmPassword(
      confirmPasswordInputDOM.value,
      passwordInputDOM.value
    )
  ) {
    !isAccountInforVaild();
    hideLoading("loadingScreenDOM");
  }
  if (!validateEmail(emailInputDOM.value)) {
    !isAccountInforVaild();
    hideLoading("loadingScreenDOM");
  }
  if (!isAccountInforVaild()) {
    window.alert("Please check your information agian");
    hideLoading("loadingScreenDOM");
  } else {
    const userInfor = new User(
      userAccountInfor.username,
      passwordInputDOM.value,
      emailInputDOM.value,
      userAccountInfor.createdAt,
      userAccountInfor.role
    );
    const updateUser = editAccount$(userLogedIn.cartID, userInfor);
    const updatedCart = updateCart$(userLogedIn.cartID, userInfor, userLogedIn);
    await Promise.all([updateUser, updatedCart]);
    hideLoading("loadingScreenDOM");
    setTimeout(() => {
      window.alert("Account information updated successfully!");
      window.location.href = `../loginPage/loginPage.html`;
    }, 200);
  }
};

window.validateInput = function validateInput(event) {
  const targetDOM = event.target;
  const inputValue = event.target.value;

  if (targetDOM == passwordInputDOM || targetDOM == confirmPasswordInputDOM) {
    const passwordInputValue = passwordInputDOM.value;
    if (targetDOM == passwordInputDOM) {
      validatePassword(inputValue);
      confirmPasswordInputDOM.value = "";
    }
    if (targetDOM == confirmPasswordInputDOM) {
      validateConfirmPassword(inputValue, passwordInputValue);
    }
  } else if (targetDOM == emailInputDOM) {
    validateEmail(inputValue);
  }
};

function validatePassword(inputValue) {
  const passwordWarningDOM = document.getElementById("passwordWarning");
  if (inputValue != userAccountInfor.password) {
    if (!inputValue) {
      errorMassage(passwordInputDOM, passwordWarningDOM);
      passwordWarningDOM.innerHTML = "Your password is empty";
      isPasswordValid = false;
    } else if (!validationPassword(inputValue)) {
      errorMassage(passwordInputDOM, passwordWarningDOM);
      passwordWarningDOM.innerHTML =
        "Your password must have 1 special character, 1 uppercase letter and must longer then 8 character";
      isPasswordValid = false;
    } else {
      passwordWarningDOM.innerHTML = "";
      passwordInputDOM.style.border = "1px solid black";
      isPasswordValid = true;
      isAccountInforVaild();
    }
  } else {
    passwordWarningDOM.innerHTML = "";
    passwordInputDOM.style.border = "1px solid black";
    isPasswordValid = true;
    isAccountInforVaild();
  }
}

function validateConfirmPassword(inputValue, passwordInputValue) {
  const confirmPasswordWarningDOM = document.getElementById(
    "confirmPasswordWarning"
  );
  if (!inputValue) {
    errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
    confirmPasswordWarningDOM.innerHTML = "Your confirm password is empty";
    isConfirmPasswordValid = false;
  } else if (inputValue != passwordInputValue) {
    errorMassage(confirmPasswordInputDOM, confirmPasswordWarningDOM);
    confirmPasswordWarningDOM.innerHTML =
      "Your password and confirm password must the same";
    isConfirmPasswordValid = false;
  } else {
    confirmPasswordWarningDOM.innerHTML = "";
    confirmPasswordInputDOM.style.border = "1px solid black";
    isConfirmPasswordValid = true;
    isAccountInforVaild();
  }
}

function validateEmail(inputValue) {
  const emailWarningDOM = document.getElementById("emailWarning");
  if (inputValue != userAccountInfor.email) {
    if (!inputValue) {
      errorMassage(emailInputDOM, emailWarning);
      emailWarningDOM.innerHTML = "Your email is empty";
      isEmailValid = false;
    } else if (!validationEmail(inputValue)) {
      errorMassage(emailInputDOM, emailWarningDOM);
      emailWarningDOM.innerHTML = "Your email is not valid";
      isEmailValid = false;
    } else if (isEmailExisted(inputValue)) {
      errorMassage(emailInputDOM, emailWarningDOM);
      emailWarningDOM.innerHTML =
        "Your email is existed !, please try new one ";
      isEmailValid = false;
    } else {
      emailWarningDOM.innerHTML = "";
      emailInputDOM.style.border = "1px solid black";
      isEmailValid = true;
      isAccountInforVaild();
    }
  } else {
    emailWarningDOM.innerHTML = "";
    emailInputDOM.style.border = "1px solid black";
    isEmailValid = true;
    isAccountInforVaild();
  }
}

function isAccountInforVaild() {
  if (isPasswordValid && isConfirmPasswordValid && isEmailValid) {
    return true;
  } else {
    return false;
  }
}

function getUserID(userNameLogedIn) {
  return listUser.find((user) => user.username == userNameLogedIn);
}

function isEmailExisted(emailInput) {
  return listUser.some((user) => user.email == emailInput);
}

function isUserRequestedRole(userLogedInInformation) {
  return listRoleReuquested.some(
    (request) => request.idUser == userLogedInInformation
  );
}

function isRequestApproved() {
  return listRoleReuquested.some(
    (request) =>
      request.idUser == userLogedInInformation.idUser &&
      request.roleRequest == userLogedInInformation.role
  );
}

function getPersonDeniedRequest(key) {
  return sessionStorage.getItem(key);
}

function errorMassage(valueInput, textWarning) {
  valueInput.style.border = "3px solid rgb(205, 82, 82)";
  textWarning.style.color = "red";
}

window.back = function back() {
  window.location.href = `../shoppingCart/shoppCart.html`;
};
