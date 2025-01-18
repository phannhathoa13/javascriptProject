import { addProductToCartContainerUser, fetchCartFromApi } from "../../controllers/cartControllers.js";
import { fetchProductAPI } from "../../controllers/productControllers.js";
import Cart from "../../models/cartModels.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../routes/cartRoutes.js";
const getListProduct = await fetchProductAPI();
const listCart = await fetchCartFromApi();

const getUserIDInParam = getValueInQuerryParam('cartID');
const userLogedIn = getUserInCart();

displayListProduct();
function displayListProduct() {
    const listProductDOM = document.getElementById('listProduct');
    getListProduct.forEach(products => {
        const productsDOM = document.createElement("div");
        const buttonAddToCart = document.createElement("button");
        productsDOM.textContent = `${products.productName}, amount: ${products.amount}, price: ${products.price}`;
        buttonAddToCart.textContent = "ADD";
        buttonAddToCart.onclick = () => {
            addToCart(products.productName, parseFloat(products.price));
        }
        productsDOM.appendChild(buttonAddToCart);
        listProductDOM.appendChild(productsDOM);
    });
}

async function addToCart(nameProductDOM, priceProductDOM) {
    try {
        const createAt = new Date();
        if (userLogedIn && userLogedIn.products && userLogedIn.products.length > 0) {
            const product = userLogedIn.products.find((product_) => product_.productName == nameProductDOM);
            if (product) {
                product.amount += 1;
                userLogedIn.totalPrice += product.price;
            }
            else {
                userLogedIn.products.push({
                    productName: nameProductDOM,
                    amount: 1,
                    price: priceProductDOM,
                });
            };
            await addProductToCartContainerUser(getUserIDInParam, { products: userLogedIn.products });
        }
        else {
            const cartValue = new Cart(
                userLogedIn.user,
                createAt.toDateString()
            )
            cartValue.products.push({
                productName: nameProductDOM,
                amount: 1,
                price: priceProductDOM,
            })
            cartValue.totalPrice += priceProductDOM;
            await addProductToCartContainerUser(getUserIDInParam, cartValue);
        }
    } catch (error) {
        console.error(error);
    }
}

function getUserInCart() {
    return listCart.find((cart) => cart.cartID == getUserIDInParam);
}

window.viewCart = function viewCart() {
    window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`
}
window.logOut = function logOut() {
    window.location.href = "../loginPage/loginPage.html";
}
