
import { fetchCartFromUserLogedIn, updateNewValueInUserCart } from "../../../controllers/cartControllers.js";
import { deleteProductInAPI, fetchProductAPI, updateNewProductValueToApi } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIdAndValueToParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const listProduct = await fetchProductAPI()
const getValueInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getValueInParam);
showListProductInCartUser();
async function showListProductInCartUser() {
    try {
        showLoading('loadingScreen');
        const listProductDOM = document.getElementById('listProductInCart');
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
        const updatedCart = await updateNewValueInUserCart(userLogedIn.cartID, userLogedIn, filterProductExisted, updatedTotalPrice);
        if (updatedCart) {
            userLogedIn = updatedCart
        }
    } catch (error) {
        console.error(`Delete error: ${error}`);
    }
    finally {
        window.alert("remove successed");
        hideLoading('loadingScreen');
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
            return updateNewProductValueToApi(product.id, product)
        })

        await Promise.all(changeProductPromise);

        const updatedListCart = await updateNewValueInUserCart(userLogedIn.cartID, userLogedIn, [], 0);
        if (updatedListCart) {
            userLogedIn = updatedListCart;
            window.alert("Payment successed");
            window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
        }
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
