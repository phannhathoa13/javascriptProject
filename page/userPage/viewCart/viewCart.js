
import { fetchCartFromApi, updateProductInApi } from "../../../controllers/cartControllers.js";
import { fetchProductAPI, updateNewProductValueToApi } from "../../../controllers/productControllers.js";
import { getValueInQuerryParam, postCartIdAndValueToParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const cartList = await fetchCartFromApi();
const listProduct = await fetchProductAPI()
const getValueInParam = getValueInQuerryParam('cartID');
let userLogedIn = isUserLogedIn();
showListProductInCartUser();
function showListProductInCartUser() {
    const listProductInCart = document.getElementById('listProductInCart');
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
        listProductInCart.appendChild(productDOM);
    });
}

async function removeProduct(productNameDOM) {
    try {
        const filterProductExisted = userLogedIn.products.filter((products_) => products_.productName !== productNameDOM);
        const updatedTotalPrice = filterProductExisted.reduce((total, product) => total + product.price * product.amount, 0);
        const updatedCart = await updateProductInApi(userLogedIn.cartID, userLogedIn, filterProductExisted, updatedTotalPrice);
        if (updatedCart) {
            userLogedIn = updatedCart
        }
    } catch (error) {
        console.error(`Delete error: ${error}`);
    }
}

window.payment = async function payment() {
    
    const changeProduct = listProduct.map((products) => {
        const productInCart = isProductOnCartInUser(products.productName);
        if (productInCart) {
            return {
                ...products,
                amount: products.amount - productInCart.amount,
            }
        }
        return products
    })

    const changeProductPromise = changeProduct.map((product) =>{
        return updateNewProductValueToApi(product.id, product)
    })

    await Promise.all(changeProductPromise);

    for (let index = 0; index < listProduct.length; index++) {
        const productItem = listProduct[index];
        const updatedItem = changeProduct.find((product) => {
           return product.id == productItem.id
        })
        if (updatedItem) {
            productItem.amount = updatedItem.amount
        }
    }
    
    const updatedListCart = await updateProductInApi(userLogedIn.cartID, userLogedIn, [], 0);
    if (updatedListCart) {
        userLogedIn = updatedListCart;
    }
    // window.alert("Payment successed");
    // window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}

window.negativeToShoppingCart = function negativeToShoppingCart() {
    window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}

function editProductInCart(productDOM) {
    window.location.href = `../editProductInCart/editProductInCart.html${postCartIdAndValueToParam(userLogedIn.cartID, productDOM)}`
}

function isProductOnCartInUser(productNameOnCart) {
    return userLogedIn.products.find((product) => product.productName == productNameOnCart)
}

function isUserLogedIn() {
    return cartList.find((cart) => cart.cartID == getValueInParam);
}