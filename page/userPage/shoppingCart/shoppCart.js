import { addProductToCartContainerUser, fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { fetchProductAPI } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Cart from "../../../models/cartModels.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";
const getListProduct = await fetchProductAPI();


const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

const listProductDOM = document.getElementById('listProduct');

displayListProduct();
async function displayListProduct() {
    try {
        showLoading('loadingScreen');
        getListProduct.forEach(products => {
            const productsDOM = document.createElement("div");
            const buttonAddToCart = document.createElement("button");
            productsDOM.textContent = `${products.productName}, amount: ${products.amount}, price: ${products.price}`;
            buttonAddToCart.textContent = "ADD";
            buttonAddToCart.onclick = () => {
                addToCart(products.productName, parseFloat(products.price));
            }
            productsDOM.appendChild(buttonAddToCart);
            if (products.amount < 0 && products.amount == 0) {
                productsDOM.remove()
            }
            else {
                listProductDOM.appendChild(productsDOM);
            }
        });
    } catch (error) {
        console.log("loading list Product error: ", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}


async function addToCart(nameProductDOM, priceProductDOM) {
    try {
        showLoading('loadingScreen');
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
            const updatedCart = await addProductToCartContainerUser(getUserIDInParam, userLogedIn)
            if (updatedCart) {
                userLogedIn = updatedCart
            }
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

            const updatedCart = await addProductToCartContainerUser(getUserIDInParam, cartValue);
            if (updatedCart) {
                userLogedIn = updatedCart
            }
            else {
                userLogedIn = cartValue
            }
        }
    } catch (error) {
        console.error(error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

window.orderHistory = function orderHistory() {
    window.location.href = `../orderHistory/orderHistory.html${postCartIDToParam(userLogedIn.cartID)}`
}

window.viewCart = function viewCart() {
    window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`
}
window.logOut = function logOut() {
    window.location.href = "../loginPage/loginPage.html";
}
