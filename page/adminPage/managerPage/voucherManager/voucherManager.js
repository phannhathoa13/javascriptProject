import { fetchCartFromUserLogedIn } from "../../../../controllers/cartControllers.js";
import {
  createVoucher$,
  fetchListVoucher,
  removeVoucher$,
  updateVoucher$,
} from "../../../../controllers/voucherController.js";
import { checkRoleUserLogedIn } from "../../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import {
  hideLoading,
  showLoading,
} from "../../../../feautureReuse/loadingScreen.js";
import Voucher from "../../../../models/voucherModels.js";
import {
  getValueInQuerryParam,
  postCartIDToParam,
} from "../../../../routes/cartRoutes.js";
import { voucherNameRegex } from "../../../../validation/voucherValidate.js";

const getUserIDInParam = getValueInQuerryParam("cartID");
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

const listVoucher = await fetchListVoucher();

const inputContainerDOM = document.getElementById("inputContainer");
inputContainerDOM.style.margin = "15px";

const createVoucherButton = document.getElementById("createVoucher");
createVoucherButton.style.margin = "0 15px";

const voucherNameInputDOM = document.getElementById("voucherName");
const voucherAmountInputDOM = document.getElementById("amount");
const discountInputDOM = document.getElementById("discount");

const checkBoxLimitTimeDOM = document.getElementById("limitTime");
const timeLimitDOM = document.getElementById("howLongTimeLimit");
timeLimitDOM.style.display = "none";

const voucherNameWarning = document.getElementById("voucherNameWarning");
voucherNameWarning.style.margin = "15px";

let isVoucherNameVaild = false;

checkRoleUserLogedIn(userLogedIn);
displayListVoucher();
async function displayListVoucher() {
  try {
    showLoading("loadingScreenDOM");
    const listVoucherDOM = document.getElementById("listVoucher");
    listVoucher.forEach((vouchers) => {
      const voucher = getVoucher(vouchers.voucherID);

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = vouchers.limitTime - currentTime;

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);

      let timeLeftTextDOM = `${hours}h`;

      if (minutes > 0) {
        timeLeftTextDOM += ` ${minutes}m`;
      }

      const vouchersDOM = document.createElement("div");
      vouchersDOM.style.margin = "10px";
      vouchersDOM.textContent = `Voucher Name: " ${vouchers.voucherName} " ,  Amount: ${vouchers.amount}, Discount: ${vouchers.discount}, Time Left: ${timeLeftTextDOM}, State: ${vouchers.state}`;

      if (hours == 0 && minutes == 0) {
        voucher.state = "Expired";
        voucher.limitTime = 0;
        vouchersDOM.textContent = `Voucher Name: " ${vouchers.voucherName} " ,  Amount: ${vouchers.amount}, Discount: ${vouchers.discount}, Time Left: " ${vouchers.state} ", State: " ${vouchers.state} "`;
        updateVoucher$(voucher);
      }

      if (vouchers.limitTime == null) {
        vouchersDOM.textContent = `Voucher Name: " ${vouchers.voucherName} " ,  Amount: ${vouchers.amount}, Discount: ${vouchers.discount}, Time Left: Infinity, State: ${vouchers.state}`;
      }

      const removeVoucherButtonDOM = document.createElement("button");
      removeVoucherButtonDOM.textContent = "Remove";
      removeVoucherButtonDOM.style.marginLeft = "5px";
      removeVoucherButtonDOM.onclick = async () => {
        showLoading("loadingScreenDOM");

        vouchersDOM.remove();
        await removeVoucher$(voucher.voucherID);

        hideLoading("loadingScreenDOM");
        setTimeout(() => {
          window.alert("Removed voucher succcessfully");
          location.reload();
        }, 200);
      };

      listVoucherDOM.appendChild(vouchersDOM);
      vouchersDOM.appendChild(removeVoucherButtonDOM);
    });
  } catch (error) {
    console.log("Display list voucher get error", error);
  } finally {
    hideLoading("loadingScreenDOM");
  }
}
checkBoxLimitTimeDOM.onchange = () => {
  if (checkBoxLimitTimeDOM.checked) {
    timeLimitDOM.style.display = "inline-block";
  } else {
    timeLimitDOM.style.display = "none";
  }
};

window.createVoucher = async function createVoucher() {
  try {
    showLoading("loadingScreenDOM");
    const voucherNameValue = voucherNameInputDOM.value;
    const voucherAmountValue = parseInt(voucherAmountInputDOM.value);
    const discountValue = parseInt(discountInputDOM.value);

    const timeLimitValue = timeLimitDOM.value;

    const voucher = createVoucherObject(
      voucherNameValue,
      voucherAmountValue,
      discountValue,
      null
    );

    if (checkBoxLimitTimeDOM.checked) {
      const limitTime =
        Math.floor(Date.now() / 1000) + timeLimitValue * 60 * 60;
      voucher.limitTime = limitTime;
      if (
        validateVoucher(voucherNameValue, voucherAmountValue, discountValue) &&
        isVoucherNameVaild
      ) {
        if (!timeLimitValue) {
          window.alert("Please input time limit");
          hideLoading("loadingScreenDOM");
        } else if (timeLimitValue <= 0) {
          window.alert("The minimum time limit is 1 hour.");
          hideLoading("loadingScreenDOM");
        } else {
          showLoading("loadingScreenDOM");
          await createVoucher$(voucher);
          hideLoading("loadingScreenDOM");

          setTimeout(() => {
            window.alert("Created Voucher Successfully");
            location.reload();
          }, 200);
        }
      }
    } else {
      if (
        validateVoucher(voucherNameValue, voucherAmountValue, discountValue) &&
        isVoucherNameVaild
      ) {
        showLoading("loadingScreenDOM");
        await createVoucher$(voucher);
        hideLoading("loadingScreenDOM");

        setTimeout(() => {
          window.alert("Created Voucher Successfully");
          location.reload();
        }, 200);
      }
    }
  } catch (error) {
    console.log("Create Voucher get error", error);
  }
};

function createVoucherObject(
  voucherNameValue,
  voucherAmountValue,
  discountValue,
  timeLimit
) {
  return new Voucher(
    voucherNameValue,
    voucherAmountValue,
    discountValue,
    timeLimit,
    "Valid"
  );
}

function validateVoucher(voucherNameValue, voucherAmountValue, discountValue) {
  if (!voucherNameValue) {
    window.alert("Please check your voucher name");
    hideLoading("loadingScreenDOM");
    return false;
  } else if (!voucherAmountValue) {
    window.alert("Please input voucher amount");
    hideLoading("loadingScreenDOM");
    return false;
  } else if (voucherAmountValue <= 0) {
    window.alert("Voucher amount must over 0");
    hideLoading("loadingScreenDOM");
    return false;
  } else if (!discountValue) {
    window.alert("Please input voucher discount");
    hideLoading("loadingScreenDOM");
    return false;
  } else if (discountValue <= 0) {
    window.alert("Voucher discount must over 0");
    hideLoading("loadingScreenDOM");
    return false;
  } else {
    hideLoading("loadingScreenDOM");
    return true;
  }
}

function isVoucherExisted(voucherNameInput) {
  return listVoucher.some(
    (vouchers) => vouchers.voucherName == voucherNameInput
  );
}

window.validateOnInputVoucherName = function validateOnInputVoucherName(event) {
  const voucherNameInput = event.target.value;
  if (!voucherNameInput) {
    voucherNameWarning.style.color = "red";
    voucherNameWarning.textContent = `Please check your voucher name`;
    voucherNameInputDOM.style.border = "2px solid red";
    isVoucherNameVaild = false;
  } else if (!voucherNameRegex(voucherNameInput)) {
    voucherNameWarning.style.color = "red";
    voucherNameWarning.textContent = `Voucher name must be exactly 8 characters, containing only uppercase letters`;
    voucherNameInputDOM.style.border = "2px solid red";
    isVoucherNameVaild = false;
  } else if (isVoucherExisted(voucherNameInput)) {
    voucherNameWarning.style.color = "red";
    voucherNameWarning.textContent = `Voucher is already existed`;
    voucherNameInputDOM.style.border = "2px solid red";
    isVoucherNameVaild = false;
  } else {
    voucherNameWarning.style.color = "red";
    voucherNameWarning.textContent = "";
    voucherNameInputDOM.style.border = "1px solid black";
    isVoucherNameVaild = true;
  }
};

function getVoucher(voucherIDDOM) {
  return listVoucher.find((vouchers) => vouchers.voucherID == voucherIDDOM);
}

window.back = function back() {
  window.location.href = `../../../userPage/shoppingCart/shoppCart.html${postCartIDToParam(
    userLogedIn.cartID
  )}`;
};
