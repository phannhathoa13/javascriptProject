import { fetchCartFromUserLogedIn, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { fetchListOrder } from "../../../controllers/orderControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const getuserId = getValueInQuerryParam("cartID");
const orderHistoryID = getValueInQuerryParam("orderID");
const listOrder = await fetchListOrder();
let userLogedIn = await fetchCartFromUserLogedIn(getuserId);
const listOrderHistoryDOM = document.getElementById('listOrderHistory');
const totalPriceDOM = document.getElementById('totalPrice');
const orderIdDOM = document.getElementById('orderId');
const paidTimeDOM = document.getElementById('paidTime');


displayProductsOrder();
function displayProductsOrder() {
    try {
        showLoading("loadingScreen");
        const orderHistory = getOrderHistory();
        let totalPrice = 0;
        orderIdDOM.innerHTML = `Your Order ID: ${orderHistory.orderID}`;
        paidTimeDOM.innerHTML = `Order Created At: ${orderHistory.createdAt}`;

        orderHistory.cartList.forEach((products) => {
            const productDiv = document.createElement("div");
            productDiv.style.display = "flex";
            productDiv.style.margin = "10px";

            const imageProductDOM = document.createElement("img");
            imageProductDOM.src = products.imageProduct;
            imageProductDOM.style.width = "100px";
            imageProductDOM.style.height = "60px";

            const productDOM = document.createElement("div");
            productDOM.textContent = `product: ${products.productName}, amount: ${products.amount}, price: ${products.price}$`;
            productDOM.style.placeContent = "center";
            productDOM.style.margin = "10px";

            totalPrice += products.amount * products.price;
            totalPriceDOM.innerHTML = `Your Total Price: ${totalPrice}$`;

            listOrderHistoryDOM.appendChild(productDiv);
            productDiv.appendChild(imageProductDOM);
            productDiv.appendChild(productDOM);
        });
    } catch (error) {
        console.log("display products order get error", error);
    } finally {
        hideLoading("loadingScreen");
    }

}

window.reOrder = async function reOrder() {
    try {
        const orderHistory = getOrderHistory();
        if (userLogedIn.products.length == 0) {
            const purchasedProducts = orderHistory.cartList.map((products) => {
                userLogedIn.cartList = products;
                return products
            })
            const updatedTotalPrice = purchasedProducts.reduce((total, products) => total + products.amount * products.price, 0);
            const updatedCart = await updateCartInAccount(userLogedIn.cartID, userLogedIn, purchasedProducts, updatedTotalPrice);
            if (updatedCart) {
                userLogedIn = updatedCart;
                window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`;
            }
        }
        else {
            document.getElementById('alertInfor').style.display = "block";
        }
    } catch (error) {
        console.log("ReOrder get error", error);
    }

}

window.createNewOrder = async function createNewOrder() {
    try {
        showLoading("loadingScreen");
        const orderHistory = getOrderHistory();
        const purchasedProducts = orderHistory.cartList.map((products) => {
            userLogedIn.cartList = { ...products }
            return products
        })
        const updatedTotalPrice = purchasedProducts.reduce((total, products) => total + products.amount * products.price, 0)
        const updatedCart = await updateCartInAccount(userLogedIn.cartID, userLogedIn, purchasedProducts, updatedTotalPrice);
        if (updatedCart) {
            userLogedIn = updatedCart;
            hideLoading("loadingScreen");
            setTimeout(() => {
                window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`;
            }, 100);
        }
    } catch (error) {
        console.log("Create new order get error", error);
    }
}

window.addProductsToCart = async function addProductsToCart() {
    try {
        showLoading("loadingScreen");
        const orderHistory = getOrderHistory();
        orderHistory.cartList.forEach((productsPurchased) => {
            const productExisted = getProductExisted(productsPurchased.productName);
            if (productExisted) {
                productExisted.amount += productsPurchased.amount;
            }
            else {
                userLogedIn.products.push({ ...productsPurchased });
            }
        })
        const updatedTotalPrice = userLogedIn.products.reduce((total, product) => total + product.amount * product.price, 0);
        const updatedCart = await updateCartInAccount(userLogedIn.cartID, userLogedIn, userLogedIn.products, updatedTotalPrice);
        if (updatedCart) {
            userLogedIn = updatedCart;
            hideLoading("loadingScreen");
            setTimeout(() => {
                window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`;
            }, 100);
        }
    } catch (error) {
        console.log("ReOrder get error", error);
    }
}

window.cancel = function cancel() {
    document.getElementById('alertInfor').style.display = "none";
}

window.back = function back() {
    window.location.href = `../orderHistory/orderHistory.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function getProductExisted(productPurchased) {
    return userLogedIn.products.find((products) => products.productName == productPurchased);
}

function getOrderHistory() {
    return listOrder.find((order) => order.orderID == orderHistoryID)
}
