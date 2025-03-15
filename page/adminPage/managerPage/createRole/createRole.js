import { fetchCartFromUserLogedIn } from "../../../../controllers/cartControllers.js";
import { createRole$, fetchListRole } from "../../../../controllers/rolesControllers.js";
import { getValueSeasion, roleCanAccessFeature } from "../../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import { RoleOwner, RoleUserAdmin } from "../../../../models/rolesModels.js";

const listRole = await fetchListRole()
const getUserId = getValueSeasion('idUserLogedIn');
let userLogedIn = await fetchCartFromUserLogedIn(getUserId);
const codeNameDOM = document.getElementById('codeName');
const rolesSelectedDOM = document.getElementById('roles');
roleCanAccessFeature(["OWNER"]);

hideLoading("loadingScreen");

window.createCodeRoles = async function createCodeRoles() {
    try {
        showLoading("loadingScreen");
        const codeNameValue = codeNameDOM.value;
        const roleSelectedValue = rolesSelectedDOM.value;
        const roleUserAdmin = new RoleUserAdmin(
            codeNameValue
        )
        const roleOwner = new RoleOwner(
            codeNameValue
        )
        if (roleSelectedValue == "USERADMIN") {
            if (validateCodeName(codeNameValue)) {
                await createRole$(roleUserAdmin);
                hideLoading("loadingScreen");
                setTimeout(() => {
                    window.alert("Created Code For Role UserAdmin");
                    location.reload();
                }, 100);

            }
        }
        else if (roleSelectedValue == "OWNER") {
            if (validateCodeName(codeNameValue)) {
                await createRole$(roleOwner);
                hideLoading("loadingScreen");
                setTimeout(() => {
                    window.alert("Created Code For Role Owner");
                    location.reload();
                }, 100);
            }
        }
    } catch (error) {
        console.log("Create role get error", error);
    }
}

function validateCodeName(codeNameInput) {
    if (!codeNameInput) {
        hideLoading("loadingScreen");
        window.alert("Please input the code name");
        return false;
    }
    else if (isCodeNameExisted(codeNameInput)) {
        hideLoading("loadingScreen");
        window.alert("This code is existed");
        return false;
    }
    else if (!validateCodeInput(codeNameInput)) {
        hideLoading("loadingScreen");
        window.alert("Your code name is not valid !");
        return false;
    }
    else {
        return true;
    }
}

window.validateCodeNameDOM = function validateCodeNameDOM(event) {
    const codeNameInput = event.target.value;
    const inputWarningFather = document.getElementById('inputWarning')
    inputWarningFather.style.marginLeft = "50px";
    inputWarningFather.style.color = "red";
    inputWarningFather.style.fontSize = "16px";
    if (!codeNameInput) {
        inputWarningFather.innerHTML = "Please input the code name";
    }
    else if (isCodeNameExisted(codeNameInput)) {
        inputWarningFather.innerHTML = "This code is existed";
    }
    else if (!validateCodeInput(codeNameInput)) {
        inputWarningFather.innerHTML = "All must be uppercase and at least 6 words";
    }
    else {
        inputWarningFather.innerHTML = ""
    }
}

function validateCodeInput(codeNameInput) {
    return /^[A-Z]+.{6,}$/g.test(codeNameInput);
}

function isCodeNameExisted(codeNameInput) {
    return listRole.some((role) => role.codeName.toLowerCase() == codeNameInput.toLowerCase());
}

window.back = function back() {
    window.location.href = `../accountManager/accountManager.html`
}