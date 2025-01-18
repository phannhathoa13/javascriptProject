import { fetchCartFromApi, updateProductInApi } from "../../controllers/cartControllers.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../routes/cartRoutes.js";

const valueInParam = getValueInQuerryParam('product');
const getCartID = getValueInQuerryParam('cartID');
const cartList = await fetchCartFromApi();

const userLogedIn = isUserLogedIn();

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
        if (product_.productName == valueInParam.productName) {
            return {
                ...product_,
                productName: product_.productName,
                amount: amountValue,
                price: product_.price
            }
        }
        return product_
    })
    console.log(updatedProduct);
    const updatedTotalPrice = updatedProduct.reduce((total, product) => total + product.price * product.amount, 0);
    await updateProductInApi(userLogedIn.cartID, userLogedIn, updatedProduct, updatedTotalPrice);
    window.alert("edit successed");
    window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`;
})


function isUserLogedIn() {
    return cartList.find((cart) => cart.cartID == getCartID);
}

