import {
  fetchCartFromUserLogedIn,
  updateCart$,
  updateCartInAccount,
} from "../../../controllers/cartControllers.js";
import { createOrder } from "../../../controllers/orderControllers.js";
import {
  fetchProductAPI,
  updateProduct,
} from "../../../controllers/productControllers.js";
import { fetchListVoucher } from "../../../controllers/voucherController.js";
import {
  getValueSeasion,
  roleCanAccessFeature,
} from "../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import {
  hideLoading,
  showLoading,
} from "../../../feautureReuse/loadingScreen.js";
import Order from "../../../models/order.js";
import { postProductIdToParam } from "../../../routes/productRoutes.js";

const listProduct = await fetchProductAPI();
const listVoucher = await fetchListVoucher();
const getUserId = getValueSeasion("idUserLogedIn");
let userLogedIn = await fetchCartFromUserLogedIn(getUserId);

const listVoucherContainerDOM = document.getElementById("listVoucherContainer");
listVoucherContainerDOM.style.display = "none";
const selectBoxContainerDOM = document.getElementById("selectBoxContainer");
selectBoxContainerDOM.style.backgroundColor = "#f9f9f9";

const listRanking = ["Member", "VIP", "VVIP"];

let totalPrice = 0;
let discountedPrice = 0;
let voucherDiscountList = [];

const discountedPriceDOM = document.getElementById("discountedPrice");


const rankMember = getRanking("Member");
const rankVIP = getRanking("VIP");
const rankVVIP = getRanking("VVIP");

roleCanAccessFeature(["CUSTOMER", "USERADMIN", "OWNER"]);

showListProductInCartUser();
displayListVoucherDOM();
async function showListProductInCartUser() {
  try {
    showLoading("loadingScreen");
    const totalPriceDOM = document.getElementById("totalPrice");

    const listProductDOM = document.getElementById("listProductInCart");

    if (userLogedIn.products.length == 0) {
      window.alert("Your cart is empty");
      window.location.href = `../shoppingCart/shoppCart.html`;
    }

    userLogedIn.products.forEach(async (product_) => {
      const productDivDOM = document.createElement("div");
      productDivDOM.style.display = "flex";
      productDivDOM.style.margin = "10px";

      const productDOM = document.createElement("div");
      productDOM.textContent = `product name: ${product_.productName}, amount: ${product_.amount}, price: $${product_.price} `;
      productDOM.style.placeContent = "center";
      productDOM.style.margin = "10px";

      totalPrice += product_.amount * product_.price;

      const imageProductDOM = document.createElement("img");
      imageProductDOM.src = product_.imageProduct;
      imageProductDOM.style.width = "100px";
      imageProductDOM.style.height = "60px";

      const buttonEditDOM = document.createElement("button");
      buttonEditDOM.textContent = "Edit";
      buttonEditDOM.style.margin = "10px";
      buttonEditDOM.onclick = () => {
        editProductInCart(product_.id);
      };

      const buttonRemoveDOM = document.createElement("button");
      buttonRemoveDOM.textContent = "Remove";
      buttonRemoveDOM.style.margin = "2px";
      buttonRemoveDOM.onclick = () => {
        productDivDOM.remove();
        removeProduct(product_.productName);
      };

      listProductDOM.appendChild(productDivDOM);
      productDivDOM.appendChild(imageProductDOM);
      productDivDOM.appendChild(productDOM);
      productDOM.appendChild(buttonEditDOM);
      productDOM.appendChild(buttonRemoveDOM);

      totalPriceDOM.innerHTML = `Total Price Your Cart: ${totalPrice}$`;
      totalPriceDOM.style.margin = "5px";

      if (userLogedIn.user.ranking == rankMember) {
        await updateTotalPriceUser(totalPrice, "0%", 1);
      } else if (userLogedIn.user.ranking == rankVIP) {
        await updateTotalPriceUser(totalPrice, "10%", 0.1);
      } else if (userLogedIn.user.ranking == rankVVIP) {
        await updateTotalPriceUser(totalPrice, "20%", 0.2);
      }
    });
  } catch (error) {
    console.log("show list product in cart user is erorr", error);
  } finally {
    hideLoading("loadingScreen");
  }
}

function displayListVoucherDOM() {
  const listVoucherVaild = filterVoucherVaild();
  displayListVoucher(listVoucherVaild);
}

function displayListVoucher(listVoucherDOM) {
  const headingVoucherDOM = document.getElementById("headingVoucher");
  headingVoucherDOM.style.fontSize = "20px";
  headingVoucherDOM.style.letterSpacing = "1px";

  const listVoucherFatherDOM = document.getElementById("listVoucher");
  listVoucherFatherDOM.style.display = "flex";
  listVoucherFatherDOM.style.flexDirection = "column";
  listVoucherFatherDOM.style.gap = "10px";

  const applyVoucherDOM = document.getElementById("applyVoucher");
  applyVoucherDOM.style.backgroundColor = "aliceblue";
  applyVoucherDOM.style.fontSize = "16px";
  applyVoucherDOM.style.border = "1px solid #a0c8db";

  listVoucherDOM.forEach((vouchers) => {
    const voucherFatherContainer = document.createElement("div");
    voucherFatherContainer.style.display = "flex";
    voucherFatherContainer.style.justifyContent = "center";
    voucherFatherContainer.style.cursor = "pointer";

    const checkBoxDOM = document.createElement("input");
    checkBoxDOM.type = "checkbox";
    checkBoxDOM.id = "checkboxDOM";
    checkBoxDOM.style.display = "flex";
    checkBoxDOM.style.flex = "5%";

    hoverVoucherOption(voucherFatherContainer, checkBoxDOM);

    validateCheckBoxRanking(voucherFatherContainer, vouchers, checkBoxDOM);

    const voucherNameDOM = document.createElement("div");
    voucherNameDOM.textContent = `${vouchers.voucherName}`;
    voucherNameDOM.id = "voucherNameDOM";
    changeStyleAndDisplayVoucherDOM(voucherNameDOM, "10%");

    let timeLeftDOM = document.createElement("span");
    changeStyleAndDisplayVoucherDOM(timeLeftDOM, "20%");
    displayHoursAndMinutes(timeLeftDOM, vouchers);

    const voucherAmountDOM = document.createElement("span");
    voucherAmountDOM.textContent = `Amount: ${vouchers.amount}`;
    changeStyleAndDisplayVoucherDOM(voucherAmountDOM, "20%");

    const voucherDiscount = document.createElement("span");
    voucherDiscount.textContent = `Discount: ${vouchers.discount}%`;
    voucherDiscount.id = "discount"
    changeStyleAndDisplayVoucherDOM(voucherDiscount, "20%");

    listVoucherFatherDOM.appendChild(voucherFatherContainer);
    voucherFatherContainer.appendChild(checkBoxDOM);
    voucherFatherContainer.appendChild(voucherNameDOM);
    voucherFatherContainer.appendChild(voucherAmountDOM);
    voucherFatherContainer.appendChild(voucherDiscount);
    voucherFatherContainer.appendChild(timeLeftDOM);
  });
}

function validateCheckBoxRanking(voucherFatherContainer, vouchersDOM, checkBoxDOM) {

  checkBoxDOM.addEventListener("change", function () {
    if (checkBoxDOM.checked) {
      voucherFatherContainer.style.border = "1px solid black";
      voucherFatherContainer.style.backgroundColor = "#b3e0ff";
      if (userLogedIn.user.ranking == rankVVIP) {
        if (voucherDiscountList.length > 1) {
          checkBoxDOM.checked = false;
          window.alert("You can choose only 1 voucher");
        }
        else {
          voucherDiscountList.push(vouchersDOM)
        }
      }
    } else {
      voucherDiscountList = voucherDiscountList.filter((vouchers) => vouchers != vouchersDOM)
      voucherFatherContainer.style.border = "none";
      voucherFatherContainer.style.backgroundColor = "#f9f9f9";
    }
  });

}

function displayHoursAndMinutes(timeLeftDOM, vouchers) {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = vouchers.limitTime - currentTime;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);

  timeLeftDOM.textContent = `Time Left: ${hours}h`;

  if (minutes > 0) {
    timeLeftDOM.textContent += ` ${minutes}m`;
  }

  if (vouchers.limitTime == null) {
    timeLeftDOM.textContent = "Time Left : Forever";
  }
}

function changeStyleAndDisplayVoucherDOM(voucherDOM, flexPercent) {
  voucherDOM.style.display = "flex";
  voucherDOM.style.flex = flexPercent;
  voucherDOM.style.justifyContent = "center";
}

function hoverVoucherOption(voucherFatherContainer, checkBoxDOM) {
  voucherFatherContainer.addEventListener("mouseenter", function () {
    if (!checkBoxDOM.checked) {
      voucherFatherContainer.style.border = "1px solid black";
      voucherFatherContainer.style.backgroundColor = "#b3e0ff";
    }
  });

  voucherFatherContainer.addEventListener("mouseleave", function () {
    if (!checkBoxDOM.checked) {
      voucherFatherContainer.style.border = "none";
      voucherFatherContainer.style.backgroundColor = "#f9f9f9";
    }
  });
}

window.applyVoucher = function applyVoucher() {
  try {
    showLoading("loadingScreen");
    const voucherNameDOM = document.getElementById("voucherNameDOM").textContent;
    let percentDiscount = 0;
    voucherDiscountList.forEach((vouchers) => {
      percentDiscount += vouchers.discount / 100;
    })
    userLogedIn.totalPrice -= userLogedIn.totalPrice * percentDiscount;
    discountedPriceDOM.innerHTML = `Total Price: ${userLogedIn.totalPrice}$`;
    console.log(userLogedIn.totalPrice);
  }
  catch (error) {
    console.log("apply voucher get error", error);
  }
  finally {
    hideLoading("loadingScreen");
  }
};

async function updateTotalPriceUser(
  totalPrice,
  discountPercentDOM,
  discountPersonNumber
) {
  try {
    showLoading("loadingScreen");
    const rankMember = getRanking("Member");
    discountedPriceDOM.style.margin = "5px";
    discountedPriceDOM.style.color = "#db0000";

    const rankingDiscountDOM = document.getElementById("rankingDiscount");
    rankingDiscountDOM.style.margin = "5px";

    if (userLogedIn.user.ranking == rankMember) {
      discountedPriceDOM.style.display = "none";
      rankingDiscountDOM.style.display = "none";
    } else {
      discountedPrice = totalPrice * discountPersonNumber;
      rankingDiscountDOM.innerHTML = `Ranking: ${userLogedIn.user.ranking} discount: ${discountPercentDOM}: ${discountedPrice}$`;
      discountedPriceDOM.innerHTML = `Total Price: ${totalPrice - discountedPrice
        }$`;
      userLogedIn.totalPrice = totalPrice - discountedPrice;
      await updateCart$(userLogedIn.cartID, userLogedIn.user, userLogedIn);
    }
  } catch (error) {
    console.log("update total price user get error", error);
  } finally {
    hideLoading("loadingScreen");
  }
}

async function removeProduct(productNameDOM) {
  try {
    showLoading("loadingScreen");
    if (userLogedIn.products.length == 0) {
      setTimeout(() => {
        window.alert("Your cart is empty");
        window.location.href = `../shoppingCart/shoppCart.html`;
      }, 100);
    }
    const filterProductExisted = userLogedIn.products.filter(
      (products_) => products_.productName !== productNameDOM
    );
    const updatedTotalPrice = filterProductExisted.reduce(
      (total, product) => total + product.price * product.amount,
      0
    );
    const updatedCart = await updateCartInAccount(
      userLogedIn.cartID,
      userLogedIn,
      filterProductExisted,
      updatedTotalPrice
    );
    if (updatedCart) {
      userLogedIn = updatedCart;
      hideLoading("loadingScreen");
      setTimeout(() => {
        window.alert("Remove successed");
        location.reload();
      }, 100);
    }
  } catch (error) {
    console.error(`Delete error: ${error}`);
  }
}

window.chooseVoucher = function chooseVoucher() {
  listVoucherContainerDOM.style.display = "flex";
  listVoucherContainerDOM.onclick = () => {
    listVoucherContainerDOM.style.display = "none";
  };
  selectBoxContainerDOM.onclick = (event) => {
    event.stopPropagation();
  };
};

window.payment = async function payment() {
  try {
    showLoading("loadingScreen");
    const orderHistory = createOrderAfterPayment();
    for (const productsInCart of userLogedIn.products) {
      const productExisted = getProductInStock(productsInCart.productName);
      if (productExisted) {
        const newProductValue = {
          ...productExisted,
          amount: productExisted.amount - productsInCart.amount,
        };
        await updateProduct(newProductValue.id, newProductValue);
      }
    }
    await createOrder(orderHistory);
    await updateCartInAccount(userLogedIn.cartID, userLogedIn, [], 0);
    console.log(userLogedIn);
    hideLoading("loadingScreen");

    setTimeout(() => {
      window.alert("Payment successed");
      window.location.href = `../shoppingCart/shoppCart.html`;
    }, 100);
  } catch (error) {
    console.log("payment error: ", error);
  }
};

function getProductInStock(productInCart) {
  return listProduct.find((products) => products.productName == productInCart);
}

function createOrderAfterPayment() {
  const createAt = new Date().toDateString();
  const orderHistory = new Order(
    userLogedIn.user,
    userLogedIn.products,
    userLogedIn.totalPrice,
    "PAID",
    createAt
  );
  return orderHistory;
}
function getRanking(userLogedInRanking) {
  return listRanking.find((ranking) => ranking == userLogedInRanking);
}

window.back = function back() {
  window.location.href = `../shoppingCart/shoppCart.html`;
};

function editProductInCart(productID) {
  window.location.href = `../editProductInCart/editProductInCart.html${postProductIdToParam(
    productID
  )}`;
  console.log(productName);
}

function getVoucher(voucherNameDOM) {
  return listVoucher.find((vouchers) => vouchers.voucherName == voucherNameDOM);
}

function filterVoucherVaild() {
  return listVoucher.filter(
    (vouchers) => vouchers.limitTime != 0 || vouchers.limitTime == null
  );
}
