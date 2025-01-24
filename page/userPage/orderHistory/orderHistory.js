import { fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { fetchListOrder } from "../../../controllers/orderControllers.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const getuserId = getValueInQuerryParam('cartID');
const userLogedIn = await fetchCartFromUserLogedIn(getuserId);
const orderList = await fetchListOrder();
let totalPrice = 0;
displayOrderHistory();
function displayOrderHistory() {
    try {
        const listProductFather = document.getElementById('listProductInCart');
        const username = userLogedIn.user.username
        const ordersByUser = getOrderWithHistory(username);

        if (isUserCartEmpty(ordersByUser) == "empty") {
            window.alert("You don't have any order history");
            return;
        }
        ordersByUser.forEach(({ products, paymentTime }) => {
            const productsDOM = document.createElement("div");
            productsDOM.textContent = `payment time: ${paymentTime} - ${products.productName}, amount: ${products.amount}, price: ${products.price}`;
            totalPrice += products.amount * products.price;
            listProductFather.appendChild(productsDOM);
            document.getElementById('totalprice').innerHTML = `You've been paid: ${totalPrice} $`;
        });
    } catch (error) {
        console.log(`Display order History error`, error);
    }
}

function getOrderWithHistory(usernameByUser) {
    return orderList
        .filter((users) => users.user.username == usernameByUser)
        .flatMap(order =>
            order.cartList.map((products) => ({
                products,
                paymentTime: order.createdAt
            }))
        )
}

window.back = function back() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(getuserId)}`;
}

function isUserCartEmpty(ordersByUser) {
    return ordersByUser.length == 0 ? "empty" : null
}