import { fetchListOrder } from "../../../../controllers/orderControllers.js";

const listOrder = await fetchListOrder();

showListOrderInDOM();
window.searchOrderByUser = function searchOrderByUser(event) {
    const usernameInput = event.target.value;
    console.log(usernameInput);
}

function showListOrderInDOM() {
    const ListOrderFather = document.getElementById('listOrder');
    const userContainerFather = document.getElementById('usercontainer');

    listOrder.forEach((order) => {
        const userDiv = document.createElement("div");
        userDiv.textContent = `user: ${order.user.username}, order created at: ${order.createdAt}, total price paid: ${order.totalPrice}$`;
        userContainerFather.appendChild(userDiv);
    })
    listOrder.flatMap((order) => order.cartList).map((order) => {
        const cartDiv = document.createElement("div");
        cartDiv.textContent = `- product: ${order.productName}, amount: ${order.amount}, price: ${order.price}`;
        ListOrderFather.appendChild(cartDiv);
    })
    const hr = document.createElement('hr');
    ListOrderFather.appendChild(hr);
}