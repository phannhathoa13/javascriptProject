import { fetchCartFromUserLogedIn, updateCart$, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { createOrder } from "../../../controllers/orderControllers.js";
import { fetchProductAPI, updateProduct } from "../../../controllers/productControllers.js";
import { fetchListVoucher } from "../../../controllers/voucherController.js";
import { checkRoleUserLogedIn } from "../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Order from "../../../models/order.js";
import { getValueInQuerryParam, postCartIdAndValueToParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const listProduct = await fetchProductAPI();
const listVoucher = await fetchListVoucher();
const getValueInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getValueInParam);
const listVoucherContainerDOM = document.getElementById('listVoucherContainer');

console.log(userLogedIn);

const listRanking = ["Member", "VIP", "VVIP"];

let totalPrice = 0;
let discountedPrice = 0;

checkRoleUserLogedIn(userLogedIn);
showListProductInCartUser();
displayListVoucher();
async function showListProductInCartUser() {
    try {
        showLoading('loadingScreen');
        const totalPriceDOM = document.getElementById('totalPrice');

        const listProductDOM = document.getElementById('listProductInCart');

        if (userLogedIn.products.length == 0) {
            window.alert("Your cart is empty");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
        }

        userLogedIn.products.forEach(async (product_) => {
            const productDivDOM = document.createElement("div");
            productDivDOM.style.display = "flex";
            productDivDOM.style.margin = "10px";

            const productDOM = document.createElement("div");
            productDOM.textContent = `product name: ${product_.productName}, amount: ${product_.amount}, price: $${product_.price} `
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
                editProductInCart(product_);
            }

            const buttonRemoveDOM = document.createElement("button");
            buttonRemoveDOM.textContent = "Remove";
            buttonRemoveDOM.style.margin = "2px";
            buttonRemoveDOM.onclick = () => {
                productDivDOM.remove();
                removeProduct(product_.productName);
            }

            listProductDOM.appendChild(productDivDOM);
            productDivDOM.appendChild(imageProductDOM);
            productDivDOM.appendChild(productDOM);
            productDOM.appendChild(buttonEditDOM);
            productDOM.appendChild(buttonRemoveDOM);

            totalPriceDOM.innerHTML = `Total Price Your Cart: ${totalPrice}$`;
            totalPriceDOM.style.margin = "5px";

            const rankMember = getRanking("Member");
            const rankVIP = getRanking("VIP");
            const rankVVIP = getRanking("VVIP");

            if (userLogedIn.user.ranking == rankMember) {
                await updateTotalPriceUser(totalPrice, "0%", 1);
            }
            else if (userLogedIn.user.ranking == rankVIP) {
                await updateTotalPriceUser(totalPrice, "10%", 0.1);
            }
            else if (userLogedIn.user.ranking == rankVVIP) {
                await updateTotalPriceUser(totalPrice, "20%", 0.2);
            }
        });
    } catch (error) {
        console.log("show list product in cart user is erorr", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

function displayListVoucher() {
    const listVoucherDOM = document.getElementById('listVoucher');
    listVoucher.forEach((vouchers) => {
        const vouchersDOM = document.createElement("div");
        vouchersDOM.textContent = `${vouchers.voucherName};`;
        listVoucherDOM.appendChild(vouchersDOM);
    })
}

window.chooseVoucher = function chooseVoucher() {
    listVoucherContainerDOM.style.display = "flex";
}



async function updateTotalPriceUser(totalPrice, discountPercentDOM, discountPersonNumber) {
    const rankMember = getRanking("Member");
    const discountedPriceDOM = document.getElementById('discountedPrice');
    discountedPriceDOM.style.margin = "5px";
    discountedPriceDOM.style.color = "#db0000";

    const rankingDiscountDOM = document.getElementById('rankingDiscount');
    rankingDiscountDOM.style.margin = "5px";

    if (userLogedIn.user.ranking == rankMember) {
        discountedPriceDOM.style.display = "none";
        rankingDiscountDOM.style.display = "none";
    }
    else {
        discountedPrice = totalPrice * discountPersonNumber;
        rankingDiscountDOM.innerHTML = `Ranking: ${userLogedIn.user.ranking} discount: ${discountPercentDOM}: ${discountedPrice}$`;
        discountedPriceDOM.innerHTML = `Total Price: ${totalPrice - discountedPrice}$`;
        userLogedIn.totalPrice = totalPrice - discountedPrice;
        await updateCart$(userLogedIn.cartID, userLogedIn.user, userLogedIn);
    }

}

async function removeProduct(productNameDOM) {
    try {
        showLoading('loadingScreen');
        const filterProductExisted = userLogedIn.products.filter((products_) => products_.productName !== productNameDOM);
        const updatedTotalPrice = filterProductExisted.reduce((total, product) => total + product.price * product.amount, 0);
        const updatedCart = await updateCartInAccount(userLogedIn.cartID, userLogedIn, filterProductExisted, updatedTotalPrice);
        if (updatedCart) {
            userLogedIn = updatedCart
        }

        hideLoading('loadingScreen');
    }
    catch (error) {
        console.error(`Delete error: ${error}`);
    }
    finally {
        if (userLogedIn.products.length == 0) {
            setTimeout(() => {
                window.alert("Your cart is empty");
                window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
            }, 100);
        }
        else {
            displayWindowAlert("Remove sucessed");
        }
    }
}

function displayWindowAlert(string) {
    setTimeout(() => {
        window.alert(string)
    }, 100);
}

window.payment = async function payment() {
    try {
        showLoading('loadingScreen');
        const orderHistory = createOrderAfterPayment();
        for (const productsInCart of userLogedIn.products) {
            const productExisted = getProductInStock(productsInCart.productName)
            if (productExisted) {
                const newProductValue = {
                    ...productExisted,
                    amount: productExisted.amount - productsInCart.amount
                }
                await updateProduct(newProductValue.id, newProductValue);
            }
        }
        console.log(orderHistory);
        await createOrder(orderHistory);
        await updateCartInAccount(userLogedIn.cartID, userLogedIn, [], 0);
        console.log(userLogedIn);
        hideLoading('loadingScreen');

        setTimeout(() => {
            window.alert("Payment successed");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
        }, 100);
    } catch (error) {
        console.log("payment error: ", error);
    }
}

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
    )
    return orderHistory
}
function getRanking(userLogedInRanking) {
    return listRanking.find((ranking) => ranking == userLogedInRanking);
}


window.negativeToShoppingCart = function negativeToShoppingCart() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function editProductInCart(productDOM) {
    window.location.href = `../editProductInCart/editProductInCart.html${postCartIdAndValueToParam(userLogedIn.cartID, productDOM)}`
}
