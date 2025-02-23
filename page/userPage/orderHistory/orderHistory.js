import { fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { fetchListOrder } from "../../../controllers/orderControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const getuserId = getValueInQuerryParam('cartID');
const userLogedIn = await fetchCartFromUserLogedIn(getuserId);
const orderList = await fetchListOrder();
let totalPrice = 0;
displayOrderHistory();
function displayOrderHistory() {
    try {
        showLoading('loadingScreen');
        const listProductInCartDOM = document.getElementById('listProductInCart');
        const orderHistory = getOrderHistory();
        if (orderHistory.length == 0) {
            hideLoading('loadingScreen');
            window.alert("You don't have any order history");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
        }
        else {
            orderHistory.forEach((orderByUser) => {
                orderByUser.cartList.forEach((product) => {
                    const createdAtDOM = document.createElement("div");
                    const productDOM = document.createElement("div");
                    createdAtDOM.textContent = `${orderByUser.createdAt}`;
                    productDOM.textContent = `${createdAtDOM.textContent} productName: ${product.productName}, amount: ${product.amount}, price: ${orderByUser.totalPrice}`;
                    listProductInCartDOM.appendChild(productDOM);
                })
            });
        }
    } catch (error) {
        console.log("display order history get errror", error);
    } finally {
        hideLoading('loadingScreen');
    }

}

function getOrderHistory() {
    const usernameByUserLoggedIn = userLogedIn.user.username;
    return orderList.filter((order) => order.user.username == usernameByUserLoggedIn);
}


window.back = function back() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(getuserId)}`;
}

