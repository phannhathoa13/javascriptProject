
import { fetchCartFromApi, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { fetchProductAPI } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";

const valueInParam = getValueInQuerryParam('product');

const cartList = await fetchCartFromApi();

let userLogedIn = isUserLogedIn();
const listProduct = await fetchProductAPI();

let isAmountAvaiable = false;

displayValueOfProduct();

function displayValueOfProduct() {
    try {
        showLoading('loadingScreen');
        const productNameInput = document.getElementById('productName');
        const amountInput = document.getElementById('amount');
        const priceInPut = document.getElementById('price');
        productNameInput.value = valueInParam.productName;
        amountInput.value = valueInParam.amount;
        priceInPut.value = valueInParam.price;
    }
    catch (error) {
        console.log("Display value of Product In Edit error", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

window.save = async function save() {
    try {

        const updatedAndValidatedCart = validationAmountProduct();

        if (isAmountAvaiable) {
            const updateTotalPrice = updatedAndValidatedCart.reduce((total, products) => total + products.amount * products.price, 0)
            const updatedCartPromise = await updateCartInAccount(userLogedIn.cartID, userLogedIn, updatedAndValidatedCart, updateTotalPrice);
            if (updatedCartPromise) {
                window.location.href = `../viewCart/viewCart.html${postCartIDToParam(userLogedIn.cartID)}`;
            }
        }

    } catch (error) {
        console.log("Edit product get error", error);
    }
}

function validationAmountProduct() {
    const productNameInput = document.getElementById('productName').value;
    const amountValue = document.getElementById('amount').value;
    return userLogedIn.products.map((products) => {
        if (products.productName == productNameInput) {
            const productExisted = isProductExistedInListProduct(products.productName);
            if (!productExisted) {
                isAmountAvaiable = false;
                window.alert("The product is not existed");
                return products;
            }
            if (amountValue <= 0) {
                isAmountAvaiable = false;
                window.alert("The amount of your product must bigger than 0");
                return products;
            }
            if (amountValue > productExisted.amount) {
                isAmountAvaiable = false;
                window.alert("The amount of your product can't bigger than the amount of product");
                return products;
            }
            isAmountAvaiable = true;
            window.alert("Edit succesed");
            return {
                ...products,
                amount: parseFloat(amountValue)
            }
        }
        return products
    })
}


function isProductExistedInListProduct(productInCart) {
    return listProduct.find((product) => product.productName == productInCart)
}


function isUserLogedIn() {
    const getCartID = getValueInQuerryParam('cartID');
    return cartList.find((cart) => cart.cartID == getCartID);
}

