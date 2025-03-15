import { fetchCartFromUserLogedIn } from "../../../../../controllers/cartControllers.js";
import { editAccount$, fetchUserAPI } from "../../../../../controllers/userController.js";
import { getValueSeasion, roleCanAccessFeature } from "../../../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../../../feautureReuse/loadingScreen.js";
import User from "../../../../../models/user.js";
import { getUserIdFromParam } from "../../../../../routes/userRoutes.js";

const listUser = await fetchUserAPI();
const userIdFromParam = getUserIdFromParam('userID');
let getUserEdit = getUserLogedIn(userIdFromParam);

const getUserId = getValueSeasion('idUserLogedIn');
let userLogedIn = await fetchCartFromUserLogedIn(getUserId);

const usernameDOM = document.getElementById('username');
const passwordDOM = document.getElementById('password');
const emailDOM = document.getElementById('email');
roleCanAccessFeature(["OWNER"]);
displayUserToInput();

function displayUserToInput() {
    try {
        showLoading("loadingScreen");
        usernameDOM.value = getUserEdit.username;
        passwordDOM.value = getUserEdit.password;
        emailDOM.value = getUserEdit.email;
    } catch (error) {
        console.log("display user to input get error", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

document.getElementById('editAccount').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        showLoading("loadingScreen");
        const formData = new FormData(this);
        const user = new User(
            formData.get('username'),
            formData.get('password'),
            formData.get('email'),
            getUserEdit.createdAt,
            getUserEdit.role,
        )
        if (validateInput(user.username, user.email)) {
            const updatedAccount = await editAccount$(getUserEdit.idUser, user);
            if (updatedAccount) {
                getUserEdit = updatedAccount;
                hideLoading('loadingScreen');

                setTimeout(() => {
                    window.alert("Edit succeed!");
                    window.location.href = `../accountManager.html`
                }, 100);
            }
        }
    } catch (error) {
        console.log("edit accoutn get error", error);
    }

})

function validateInput(usernameInput, emailInput) {
    const usernameValue = usernameDOM.value;
    const passwordValue = passwordDOM.value;
    const emailValue = emailDOM.value;
    if (!usernameValue) {
        window.alert("Please input username, you want to change");
        hideLoading('loadingScreen');
        return false;
    }
    else if (!passwordValue) {
        window.alert("Please input password, you want to change");
        hideLoading('loadingScreen');
        return false;
    }
    else if (!emailValue) {
        window.alert("Please input email, you want to change");
        hideLoading('loadingScreen');
        return false;
    }
    else if (isUsernameExisted(usernameInput)) {
        window.alert(`${usernameInput} is already have, try new one`);
        hideLoading('loadingScreen');
        return false;
    }
    else if (isEmailExisted(emailInput)) {
        window.alert(`${emailInput} is already have, try new one`);
        hideLoading('loadingScreen');
        return false;
    }
    return true;
}

function isUsernameExisted(usernameInPut) {
    return listUser.some((users) => users.username == usernameInPut && users.idUser != getUserEdit.idUser);
}

function isEmailExisted(emailInPut) {
    return listUser.some((users) => users.email == emailInPut && users.idUser != getUserEdit.idUser);
}

function getUserLogedIn(userID) {
    return listUser.find((user) => user.idUser == userID);
}