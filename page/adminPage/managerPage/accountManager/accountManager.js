import { fetchCartFromApi, fetchCartFromUserLogedIn, removeCart$, updateCart$ } from "../../../../controllers/cartControllers.js";
import { editAccount$, fetchUserAPI, removeAccount$ } from "../../../../controllers/userController.js";
import { checkRoleUserLogedIn } from "../../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../../routes/cartRoutes.js";
import { postUserIDToParam } from "../../../../routes/userRoutes.js";
const listUser = await fetchUserAPI();
const listCart = await fetchCartFromApi();
const listAccountDOM = document.getElementById('listAccount');
const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

checkRoleUserLogedIn(userLogedIn);
displayListUser();
function displayListUser() {
    const listAccount$ = filterUserLogedIn();
    displayListUserDOM(listAccount$);
}

async function displayListUserDOM(listUserDOM) {
    try {
        showLoading("loadingScreen");
        listUserDOM.forEach((users) => {
            const userDOM = document.createElement("div");
            userDOM.textContent = `ID: ${users.idUser}, username: ${users.username}, password: `;
            userDOM.style.display = "flex";
            userDOM.style.alignItems = "center";
            userDOM.style.margin = "5px";

            const passwordSpan = document.createElement("span");
            passwordSpan.textContent = "*****";
            passwordSpan.style.cursor = "pointer";
            passwordSpan.onclick = () => {
                displayUserPassword(passwordSpan, users.password);
            }

            const emailAndDateDOM = document.createElement("span");
            emailAndDateDOM.textContent = `email: ${users.email}, created at: ${users.createdAt}`;
            emailAndDateDOM.style.marginLeft = "5px";

            const editButtonDOM = document.createElement("button");
            editButtonDOM.textContent = "EDIT";
            editButtonDOM.style.margin = "5px";

            const removeButtonDOM = document.createElement("button");
            removeButtonDOM.textContent = "Remove";
            removeButtonDOM.style.margin = "5px";

            listAccountDOM.appendChild(userDOM);
            userDOM.appendChild(passwordSpan);
            userDOM.appendChild(emailAndDateDOM);

            createRoleDropDown(userDOM, users);

            userDOM.appendChild(editButtonDOM);
            userDOM.appendChild(removeButtonDOM);

            editButtonDOM.onclick = () => {
                hideLoading('loadingScreen');
                editAccount(users.idUser);
            }
            removeButtonDOM.onclick = async function () {
                showLoading("loadingScreen");
                const updatedUser = removeAccount$(users.idUser);
                const upadtedCart = removeCart$(users.idUser);

                await Promise.all([updatedUser, upadtedCart])
                hideLoading('loadingScreen');

                setTimeout(() => {
                    window.alert("remove account succeed! ");
                    location.reload();
                }, 100);
            }

        });
    } catch (error) {
        console.log("Display list user get error", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

async function createRoleDropDown(userDOM, user) {

    const roleSelected = document.createElement("select");
    roleSelected.style.marginLeft = "5px";
    roleSelected.id = "roles";

    const firstRole = document.createElement("option");
    firstRole.textContent = `Role: ${user.role}`;

    const roleAdmin = document.createElement("option");
    roleAdmin.textContent = "USERADMIN";

    const roleOwner = document.createElement("option");
    roleOwner.textContent = "OWNER";

    const roleCustomer = document.createElement("option");
    roleCustomer.textContent = "CUSTOMER";

    roleSelected.appendChild(firstRole);
    roleSelected.appendChild(roleAdmin);
    roleSelected.appendChild(roleOwner);
    roleSelected.appendChild(roleCustomer);

    userDOM.appendChild(roleSelected);

    roleSelected.onchange = () => {
        changeRoleAccount(roleSelected.value, user);
    }

}

async function changeRoleAccount(roleSelected, user) {
    try {
        if (user.role == roleSelected) {
            window.alert(`The user: " ${user.username} " is already have this role`);
            return;
        } else {
            let cartUserInfor = getCartUser(user.username);
            if (roleSelected == "CUSTOMER") {
                showLoading("loadingScreen");
                user.role = "CUSTOMER";

                const updateUser = await updateCart$(cartUserInfor.cartID, user, cartUserInfor);
                if (updateUser) {
                    cartUserInfor = updateUser;
                }
                await editAccount$(user.idUser, user);

                displayWindowAlertAndReload(user);
            }
            else if (roleSelected == "USERADMIN") {
                showLoading("loadingScreen");
                user.role = "USERADMIN";
                const updateUser = await updateCart$(cartUserInfor.cartID, user, cartUserInfor);
                if (updateUser) {
                    cartUserInfor = updateUser;
                }
                await editAccount$(user.idUser, user);

                displayWindowAlertAndReload(user);
            }
            else if (roleSelected == "OWNER") {
                showLoading("loadingScreen");
                user.role = "OWNER";

                const updateUser = await updateCart$(cartUserInfor.cartID, user, cartUserInfor);
                if (updateUser) {
                    cartUserInfor = updateUser;
                }
                await editAccount$(user.idUser, user);

                displayWindowAlertAndReload(user);
            }
        }
    } catch (error) {
        console.log("Change role account: ", error);
    }
}

function displayWindowAlertAndReload(user) {
    hideLoading('loadingScreen');

    setTimeout(() => {
        window.alert(`Successfully updated the role of user: "${user.username}"`);
        location.reload();
    }, 100);
}

function displayUserPassword(passwordHidden, userPassword) {
    if (passwordHidden.textContent == "*****") {
        passwordHidden.textContent = userPassword;
    }
    else {
        passwordHidden.textContent = "*****";
    }
}

window.findUserName = function findUserName(event) {
    const usernameInput = event.target.value.toLowerCase();
    const filterUser = filterUsername(usernameInput);
    if (!filterUser) {
        listAccountDOM.innerHTML = "";
    }
    else if (usernameInput == "") {
        listAccountDOM.innerHTML = "";
        displayListUserDOM(listUser);
    }
    else {
        listAccountDOM.innerHTML = "";
        displayListUserDOM(filterUser);
    }
}


function filterUserLogedIn() {
    return listUser.filter((users) => users.username != userLogedIn.user.username);
}

window.createCodeRoles = function createCodeRoles() {
    window.location.href = `../createRole/createRole.html${postCartIDToParam(userLogedIn.cartID)}`;
}

window.back = function back() {
    window.location.href = `../../../userPage/shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function filterUsername(usernameInput) {
    return listUser.filter((users) => users.username.toLowerCase().includes(usernameInput));
}

function getCartUser(usernameDOM) {
    return listCart.find((users) => users.user.username == usernameDOM
    )
}

function editAccount(userID) {
    window.location.href = `../accountManager/editAccount/editAccount.html${postUserIDToParam(userID)}`;
}