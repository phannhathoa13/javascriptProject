
import { fetchCartFromApi, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { fetchProductAPI } from "../../../controllers/productControllers.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const valueInParam = getValueInQuerryParam('product');
const getCartID = getValueInQuerryParam('cartID');
const cartList = await fetchCartFromApi();

let userLogedIn = isUserLogedIn();
const listProduct = await fetchProductAPI();

const productNameInput = document.getElementById('productName');
const amountInput = document.getElementById('amount');
const priceInPut = document.getElementById('price');

productNameInput.value = valueInParam.productName;
amountInput.value = valueInParam.amount;
priceInPut.value = valueInParam.price;


document.getElementById('editValue').addEventListener('submit', async function (event) {
    event.preventDefault();
    const amountValue = amountInput.value;

    const updatedProduct = userLogedIn.products.map((product_) => {
        const productInListProduct = isProductExistedInListProduct(product_.productName);
        if (product_.productName == valueInParam.productName) {
            if (productInListProduct && amountValue > productInListProduct.amount) {
                window.alert("Your amount is out of limited");
                return;
            }
            else if (productInListProduct && amountValue == productInListProduct.amount) {
                return {
                    ...product_,
                    amount: amountValue,
                }
            }
            else if (productInListProduct && amountValue == 0) {
                window.alert("Your amount must over 0");
                return;
            }
            else {
                return {
                    ...product_,
                    productName: product_.productName,
                    amount: amountValue,
                    price: product_.price
                }
            }
        }
        return product_

    })
    const updatedTotalPrice = updatedProduct.reduce((total, product) => total + product.price * product.amount, 0);
    const updatedCartUser = await updateCartInAccount(userLogedIn.cartID, userLogedIn, updatedProduct, updatedTotalPrice);
    if (updatedCartUser) {
        userLogedIn = updatedCartUser
        window.alert("edit successed");
        window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`;
    }
})

function isProductExistedInListProduct(productNameInCart) {
    return listProduct.find((products) => products.productName == productNameInCart);
}

function isUserLogedIn() {
    return cartList.find((cart) => cart.cartID == getCartID);
}

