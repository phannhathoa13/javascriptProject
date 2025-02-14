import { fetchCartFromUserLogedIn, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { createOrder } from "../../../controllers/orderControllers.js";
import { deleteProductInAPI, fetchProductAPI } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Order from "../../../models/order.js";
import { getValueInQuerryParam, postCartIdAndValueToParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const listProduct = await fetchProductAPI()
const getValueInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getValueInParam);
showListProductInCartUser();
async function showListProductInCartUser() {
    try {
        showLoading('loadingScreen');
        const listProductDOM = document.getElementById('listProductInCart');
        if (userLogedIn.products.length == 0) {
            window.alert("Your cart is empty");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
        }
        userLogedIn.products.forEach(product_ => {
            const productDOM = document.createElement("div")
            const buttonRemoveDOM = document.createElement("button");
            const buttonEditDOM = document.createElement("button");
            productDOM.textContent = `product name: ${product_.productName}, amount: ${product_.amount}, price: $${product_.price} `
            buttonRemoveDOM.textContent = "Remove";
            buttonEditDOM.textContent = "Edit";
            buttonEditDOM.onclick = () => {
                editProductInCart(product_);
            }
            buttonRemoveDOM.onclick = () => {
                productDOM.remove();
                removeProduct(product_.productName);
            }
            productDOM.appendChild(buttonEditDOM);
            productDOM.appendChild(buttonRemoveDOM);
            listProductDOM.appendChild(productDOM);
        });
    } catch (error) {
        console.log("show list product in cart user is erorr", error);
    }
    finally {
        hideLoading('loadingScreen');
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
        window.alert("remove successed");
    }

}

window.payment = async function payment() {
    try {
        showLoading('loadingScreen');
        const changeProduct = listProduct
            .filter((products) => {
                const productInCart = isProductExistedOnCartInUser(products.productName);
                return !!productInCart;
            })
            .map((products) => {
                const productInCart = isProductExistedOnCartInUser(products.productName);
                if (productInCart) {
                    return {
                        ...products,
                        amount: products.amount - productInCart.amount,
                    }
                }
                return products
            })
        const changeProductPromise = changeProduct.map((product) => {
            if (product.amount == 0) {
                deleteProductInAPI(product.id)
            }
            return updateCartInAccount(product.id, product)
        })
        await Promise.all(changeProductPromise);

        await transferProductAndUserToOrderHistory(userLogedIn.products);

        await updateCartInAccount(userLogedIn.cartID, userLogedIn, [], 0);
        window.alert("Payment successed");
        window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
    } catch (error) {
        console.log("payment erorr", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

window.negativeToShoppingCart = function negativeToShoppingCart() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function editProductInCart(productDOM) {
    window.location.href = `../editProductInCart/editProductInCart.html${postCartIdAndValueToParam(userLogedIn.cartID, productDOM)}`
}

function isProductExistedOnCartInUser(productNameOnCart) {
    return userLogedIn.products.find((product) => product.productName == productNameOnCart)
}

async function transferProductAndUserToOrderHistory(cartInUser) {
    const createAt = new Date().toDateString();

    const totalPrice = cartInUser.reduce((acc, product) => {
        return acc + product.amount * product.price;
    }, 0)

    const order = new Order(
        userLogedIn.user,
        cartInUser,
        totalPrice,
        "Paid",
        createAt
    )
    const response = await createOrder(order);
    return response
}