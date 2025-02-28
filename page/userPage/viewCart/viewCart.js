import { fetchCartFromUserLogedIn, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { createOrder } from "../../../controllers/orderControllers.js";
import { fetchProductAPI, updateProduct } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Order from "../../../models/order.js";
import { getValueInQuerryParam, postCartIdAndValueToParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const listProduct = await fetchProductAPI();
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
            const productDivDOM = document.createElement("div");
            productDivDOM.style.display = "flex";
            productDivDOM.style.margin = "10px";

            const productDOM = document.createElement("div");
            productDOM.textContent = `product name: ${product_.productName}, amount: ${product_.amount}, price: $${product_.price} `
            productDOM.style.placeContent = "center";
            productDOM.style.margin = "10px";

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
        await createOrder(orderHistory);
        await updateCartInAccount(userLogedIn.cartID, userLogedIn, [], 0);
        hideLoading('loadingScreen');
    } catch (error) {
        console.log("payment error: ", error);
    }
    finally {
        setTimeout(() => {
            window.alert("Payment successed");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
        }, 100);
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

window.negativeToShoppingCart = function negativeToShoppingCart() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function editProductInCart(productDOM) {
    window.location.href = `../editProductInCart/editProductInCart.html${postCartIdAndValueToParam(userLogedIn.cartID, productDOM)}`
}
