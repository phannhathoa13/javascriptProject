import { fetchCartFromApi, fetchCartFromUserLogedIn, updateCart$ } from "../../../../controllers/cartControllers.js";
import { fetchListRequestRole$, removeRequest$ } from "../../../../controllers/rolesControllers.js"
import { editRoleAccount$, fetchUserAPI } from "../../../../controllers/userController.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../../routes/cartRoutes.js";

const listUser = await fetchUserAPI();
const listCart = await fetchCartFromApi();
const listRequests = await fetchListRequestRole$();
const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

const userInformation = userLogedIn.user;

displayListRequestRole();

function checkRoleUserLogedIn() {

}

function displayListRequestRole() {
    const listCustomerRequest = listReuqestRoleByAdmin();
    const listAdminRequest = listRequestsByOwner();

    if (listCustomerRequest.length == 0 && listAdminRequest.length == 0) {
        hideLoading('loadingScreenDOM');
        window.alert("There are currently no requests.");
        window.location.href = `../../../userPage/shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
    }
    else {
        if (userInformation.role == "USERADMIN") {
            displayListRequestDOM(listCustomerRequest);
        }
        if (userInformation.role == "OWNER") {
            displayListRequestDOM(listAdminRequest);
        }
    }
}

function displayListRequestDOM(listRequestRole) {
    try {
        showLoading('loadingScreenDOM');
        const listRequestRoleDOM = document.getElementById('listRequestRole');
        listRequestRoleDOM.style.margin = "20px";

        listRequestRole.forEach((request) => {
            const userRequest = getUserRequest(request.idUser);

            const requestByUser = getRequestByUser(userRequest.username);


            const cartUserRequest = getCartUserRequest(request.idUser);

            const userRequestDOM = document.createElement("div");
            userRequestDOM.textContent = `UserID:${request.idUser}, Username: " ${request.username} ", Current Role: ${userRequest.role}, Request To Role: ${request.roleRequest}`;

            userRequest.role = request.roleRequest;

            const acceptButton = document.createElement("button");
            acceptButton.textContent = "Accept";
            acceptButton.style.margin = "5px";

            acceptButton.onclick = async () => {
                await acceptRequest(userRequest, cartUserRequest, requestByUser);
            }

            const denyButton = document.createElement("button");
            denyButton.textContent = "Deny";
            denyButton.style.margin = "5px";
            denyButton.onclick = async () => {
                await denyRequest(requestByUser);
            }

            listRequestRoleDOM.appendChild(userRequestDOM);
            userRequestDOM.appendChild(acceptButton);
            userRequestDOM.appendChild(denyButton);
        })
    } catch (error) {
        console.log("display list request DOM get error", error);
    }
    finally {
        hideLoading('loadingScreenDOM');
    }

}


async function acceptRequest(userRequest, cartUserRequest, requestByUser) {
    try {
        showLoading('loadingScreenDOM');

        await editRoleAccount$(userRequest.idUser, userRequest, userRequest.role);
        await updateCart$(cartUserRequest.cartID, userRequest, cartUserRequest);
        await removeRequest$(requestByUser.id);

        hideLoading('loadingScreenDOM');

        setTimeout(() => {
            window.alert("User Role Has Been Approved");
            location.reload();
        }, 200);

    } catch (error) {
        console.log("Accept Request get error", error);
    }
}

async function denyRequest(requestByUser) {
    try {
        showLoading('loadingScreenDOM');
        await removeRequest$(requestByUser.id);
        localStorage.setItem("personDeny", userInformation.username);
        hideLoading('loadingScreenDOM');

        setTimeout(() => {
            window.alert("This request was successfully denied.");
            location.reload();
        }, 200);

    } catch (error) {
        console.log("Deny Request get error", error);
    }
}

function listReuqestRoleByAdmin() {
    return listRequests.filter((roles) => roles.roleRequest != "OWNER");
}

function listRequestsByOwner() {
    return listRequests.filter((roles) => roles.roleRequest != "USERADMIN");
}

function getUserRequest(IdUserRequest) {
    return listUser.find((users) => users.idUser == IdUserRequest);
}

function getCartUserRequest(IdUserRequest) {
    return listCart.find((carts) => carts.cartID == IdUserRequest);
}

function getRequestByUser(usernameByUser) {
    return listRequests.find((request) => request.username == usernameByUser)
}




window.back = function back() {
    window.location.href = `../../../userPage/shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`
}


