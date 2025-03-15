
import { fetchCartFromApi, fetchCartFromUserLogedIn, updateCartInAccount } from "../../../controllers/cartControllers.js";
import { fetchProductAPI } from "../../../controllers/productControllers.js";
import { getValueSeasion, roleCanAccessFeature } from "../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import { getValueInQuerryParam } from "../../../routes/cartRoutes.js";


const cartList = await fetchCartFromApi();

const getUserId = getValueSeasion('idUserLogedIn');
let userLogedIn = await fetchCartFromUserLogedIn(getUserId);

const listProduct = await fetchProductAPI();

let isAmountAvaiable = false;
roleCanAccessFeature(["CUSTOMER", "USERADMIN", "OWNER"]);

displayValueOfProduct();

function displayValueOfProduct() {
    try {
        const valueInParam = getValueInQuerryParam('productID');

        const productEdit = getProductInCart(valueInParam);
        showLoading('loadingScreen');

        const imageProductDOM = document.getElementById('previewImg');
        imageProductDOM.src = productEdit.imageProduct;

        const productNameInput = document.getElementById('productName');
        productNameInput.value = productEdit.productName;
        productNameInput.style.position = "relative";
        productNameInput.style.bottom = "24px";

        const amountInput = document.getElementById('amount');
        amountInput.value = productEdit.amount;
        amountInput.style.position = "relative";
        amountInput.style.bottom = "24px";

        const priceInPut = document.getElementById('price');
        priceInPut.value = productEdit.price;
        priceInPut.style.position = "relative";
        priceInPut.style.bottom = "24px";

        const buttonSaveDOM = document.getElementById('buttonSave');
        buttonSaveDOM.style.position = "relative";
        buttonSaveDOM.style.bottom = "24px";
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
        showLoading('loadingScreen');
        const updatedAndValidatedCart = validationAmountProduct();

        if (isAmountAvaiable) {
            const updateTotalPrice = updatedAndValidatedCart.reduce((total, products) => total + products.amount * products.price, 0)
            await updateCartInAccount(userLogedIn.cartID, userLogedIn, updatedAndValidatedCart, updateTotalPrice);
            hideLoading('loadingScreen');

            setTimeout(() => {
                window.alert("Edit succesed");
                window.location.href = `../viewCart/viewCart.html`;
            }, 100);
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
            const productExisted = getProduct(products.productName);
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
            return {
                ...products,
                amount: parseFloat(amountValue)
            }
        }
        return products
    })
}


function getProduct(productInCart) {
    return listProduct.find((product) => product.productName == productInCart)
}

function getProductInCart(productID) {
    return userLogedIn.products.find((product) => product.id == productID);
}

function isUserLogedIn() {
    const getCartID = getValueInQuerryParam('cartID');
    return cartList.find((cart) => cart.cartID == getCartID);
}

