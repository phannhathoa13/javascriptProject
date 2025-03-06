import { fetchCartFromUserLogedIn } from "../../../../controllers/cartControllers.js";
import { createRole$, fetchListRole } from "../../../../controllers/rolesControllers.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import { RoleOwner, RoleUserAdmin } from "../../../../models/rolesModels.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../../routes/cartRoutes.js";

const listRole = await fetchListRole()
const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);
const codeNameDOM = document.getElementById('codeName');
const rolesSelectedDOM = document.getElementById('roles');
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
        window.alert("Please input the code name");
        return false;
    }
    else if (isCodeNameExisted(codeNameInput)) {
        window.alert("This code is existed");
        return false;
    }
    else {
        return true;
    }
}

function isCodeNameExisted(codeNameInput) {
    return listRole.some((role) => role.codeName.toLowerCase() == codeNameInput.toLowerCase());
}

window.back = function back() {
    window.location.href = `../accountManager/accountManager.html${postCartIDToParam(userLogedIn.cartID)}`
}