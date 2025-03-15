import { fetchCartFromApi, fetchCartFromUserLogedIn, updateCart$ } from "../../../../controllers/cartControllers.js";
import { fetchListRequestRole$, removeRequest$ } from "../../../../controllers/rolesControllers.js"
import { editRoleAccount$, fetchUserAPI } from "../../../../controllers/userController.js";
import { getValueSeasion, roleCanAccessFeature } from "../../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";

const listUser = await fetchUserAPI();
const listCart = await fetchCartFromApi();
const listRequests = await fetchListRequestRole$();
const getUserId = getValueSeasion('idUserLogedIn');
let userLogedIn = await fetchCartFromUserLogedIn(getUserId);

const userInformation = userLogedIn.user;
roleCanAccessFeature(["USERADMIN", "OWNER"]);

displayListRequestRole();



function displayListRequestRole() {
  const listCustomerRequest = listReuqestRoleByAdmin();
  const listAdminRequest = listRequestsByOwner();

  if (listCustomerRequest.length == 0 && listAdminRequest.length == 0) {
    hideLoading("loadingScreenDOM");
    window.alert("There are currently no requests.");
    window.location.href = `../../../userPage/shoppingCart/shoppCart.html`;
  } else {
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
    showLoading("loadingScreenDOM");
    const listRequestRoleDOM = document.getElementById("listRequestRole");
    listRequestRoleDOM.style.margin = "20px";

    listRequestRole.forEach((request) => {
      const userRequest = getUserRequest(request.idUser);

      const requestByUser = getRequestByUser(userRequest.username);

      const cartUserRequest = getCartUserRequest(request.idUser);

      const userRequestDOM = document.createElement("div");
      userRequestDOM.textContent = `UserID:${request.idUser}, Username: " ${request.username} ", Current Role: ${userRequest.role}, Request To Role: ${request.roleRequest}`;

      const denyButton = document.createElement("button");
      denyButton.textContent = "Deny";
      denyButton.style.margin = "5px";
      denyButton.onclick = async () => {
        await denyRequest(requestByUser);
      };

      const acceptButton = document.createElement("button");
      acceptButton.textContent = "Accept";
      acceptButton.style.margin = "5px";

      if (userRequest.role == request.roleRequest) {
        acceptButton.textContent = "Approved";
        acceptButton.style.background = "#8dff8d";
        acceptButton.style.border = "1px solid #53a45a";
        acceptButton.style.color = "#000000";
        acceptButton.disabled = true;
        denyButton.style.display = "none";
      }

      userRequest.role = request.roleRequest;
      acceptButton.onclick = async () => {
        await acceptRequest(userRequest, cartUserRequest);
      };

      listRequestRoleDOM.appendChild(userRequestDOM);
      userRequestDOM.appendChild(acceptButton);
      userRequestDOM.appendChild(denyButton);
    });
  } catch (error) {
    console.log("display list request DOM get error", error);
  } finally {
    hideLoading("loadingScreenDOM");
  }
}

async function acceptRequest(userRequest, cartUserRequest) {
  try {
    showLoading("loadingScreenDOM");

    await editRoleAccount$(userRequest.idUser, userRequest, userRequest.role);
    await updateCart$(cartUserRequest.cartID, userRequest, cartUserRequest);
    hideLoading("loadingScreenDOM");

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
    showLoading("loadingScreenDOM");
    await removeRequest$(requestByUser.id);
    sessionStorage.setItem("personDeny", userInformation.username);
    sessionStorage.setItem("idUserDenied", requestByUser.idUser);
    hideLoading("loadingScreenDOM");

    setTimeout(() => {
      window.alert("This request was successfully denied.");
      location.reload();
    }, 200);
  } catch (error) {
    console.log("Deny Request get error", error);
  }
}

function listReuqestRoleByAdmin() {
  return listRequests.filter((roles) => roles.roleRequest == "USERADMIN");
}

function listRequestsByOwner() {
  return listRequests.filter((roles) => roles.roleRequest == "OWNER");
}

function getUserRequest(IdUserRequest) {
  return listUser.find((users) => users.idUser == IdUserRequest);
}

function getCartUserRequest(IdUserRequest) {
  return listCart.find((carts) => carts.cartID == IdUserRequest);
}

function getRequestByUser(usernameByUser) {
  return listRequests.find((request) => request.username == usernameByUser);
}

window.back = function back() {
  window.location.href = `../../../userPage/shoppingCart/shoppCart.html`;
};
