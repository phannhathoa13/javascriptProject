import { fetchCartFromUserLogedIn } from "../../../../controllers/cartControllers.js";
import { editRoleAccount$, fetchUserAPI, removeAccount } from "../../../../controllers/userController.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../../routes/cartRoutes.js";
import { postUserIDToParam } from "../../../../routes/userRoutes.js";
const listUser = await fetchUserAPI();
const listAccountDOM = document.getElementById('listAccount');
const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

displayListUser();
function displayListUser() {
    displayListUserDOM(listUser);
}


async function displayListUserDOM(listUserDOM) {
    try {
        showLoading("loadingScreen");
        const role = {
            customer:"CUSTOMER",
            userAdmin:"USERADMIN",
            owner:"OWNER",
        }
        listUserDOM.forEach((users) => {
            const userDOM = document.createElement("div");
            userDOM.textContent = `username: ${users.username}, password: ${users.password}, email: ${users.email}, created at: ${users.createdAt}`;
            userDOM.style.display = "flex";
            userDOM.style.alignItems = "center";
            userDOM.style.margin = "5px";

            const roleUserDOM = document.createElement("button");
            roleUserDOM.textContent = `Role: ${users.role}`;
            roleUserDOM.style.margin = "5px";

            const roleFatherContainer = document.createElement("span");
            roleFatherContainer.style.display = "flex";
            roleFatherContainer.style.flexDirection = "column";
            roleFatherContainer.style.width = "150px";
            roleFatherContainer.style.margin = "5px";
            roleFatherContainer.style.display = "none";

            const customerRole = document.createElement("button");
            customerRole.textContent = `ROLE: ${role.customer}`;
            customerRole.onclick = () => {
                changeRoleUser(users,role.customer);
            }
 
            const userAdminRole = document.createElement("button");
            userAdminRole.textContent = `ROLE: ${role.userAdmin}`;
            userAdminRole.onclick = () => {
                changeRoleUser(users,role.userAdmin);
            }

            const ownerRole = document.createElement("button");
            ownerRole.textContent = `ROLE: ${role.owner}`;
            ownerRole.onclick = () => {
                changeRoleUser(users,role.owner);
            }

            const editButtonDOM = document.createElement("button");
            editButtonDOM.textContent = "EDIT";
            editButtonDOM.style.margin = "5px";

            const removeButtonDOM = document.createElement("button");
            removeButtonDOM.textContent = "Remove";
            removeButtonDOM.style.margin = "5px";

            listAccountDOM.appendChild(userDOM);
            userDOM.appendChild(roleFatherContainer);
            roleFatherContainer.appendChild(customerRole);
            roleFatherContainer.appendChild(userAdminRole);
            roleFatherContainer.appendChild(ownerRole);
            userDOM.appendChild(roleUserDOM);
            userDOM.appendChild(editButtonDOM);
            userDOM.appendChild(removeButtonDOM);

            roleUserDOM.onclick = () => {
                displayListRole(roleFatherContainer);
                roleUserDOM.style.display = "none";
            }

            editButtonDOM.onclick = () => {
                hideLoading('loadingScreen');
                editAccount(users.idUser);
            }
            removeButtonDOM.onclick = () => {
                hideLoading('loadingScreen');
                removeAccount(users.idUser);

                setTimeout(() => {
                    window.alert("remove account succeed! ");
                    location.reload();
                }, 100);
            }

        });
    } catch (error) {
        console.log("Display list user get error", error);
    }
    finally{
        hideLoading('loadingScreen');
    }
}

async function changeRoleUser(user, role) {
    const updatedRole = await editRoleAccount$(user.idUser,user,role);
    if (updatedRole) {
        window.alert(`Changed Role User: ${user.username} to role: ${role} `)
        location.reload();
    }
}

function displayListRole(roleDOM, roleUserDOM) {
    if (roleDOM.style.display == "block"){
        roleUserDOM.style.display ="block";
    }
    else{
        roleDOM.style.display = "block";
    }
}

window.findUserName = function findUserName(event){
    const usernameInput = event.target.value.toLowerCase();
    const filterUser = filterUsername(usernameInput);
    if (!filterUser) {
        listAccountDOM.innerHTML ="";
    }
    else if(usernameInput == ""){
        listAccountDOM.innerHTML ="";
        displayListUserDOM(listUser);
    }
    else {
        listAccountDOM.innerHTML ="";
        displayListUserDOM(filterUser);
    }
}

window.back = function back() {
    window.location.href = `../producctManager/productManager.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function filterUsername(usernameInput){
    return listUser.filter((users) => users.username.toLowerCase().includes(usernameInput));
}

function editAccount(userID) {
    window.location.href = `../accountManager/editAccount/editAccount.html${postUserIDToParam(userID)}`;
}