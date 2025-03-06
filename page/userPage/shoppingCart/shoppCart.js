import { addProductToCartId, fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { deleteProduct$, fetchProductAPI } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Cart from "../../../models/cartModels.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";
const getListProduct = await fetchProductAPI();


const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);
const accountsManagerButtonDOM = document.getElementById('accountsManager');
accountsManagerButtonDOM.style.display = "none";
accountsManagerButtonDOM.style.margin = "5px"

const buttonContainer = document.getElementById('buttonContainer');
buttonContainer.style.display = "flex";

const productsManagerButtonDOM = document.getElementById('productsManager');
productsManagerButtonDOM.style.margin = "5px";

const listProductDOM = document.getElementById('listProduct');
isAdminAccountLogedIn();
accountsManager();
displayListProduct();
async function displayListProduct() {
    try {
        showLoading('loadingScreen');
        getListProduct.forEach(products => {
            const productDivDOM = document.createElement("div");
            productDivDOM.style.display = "flex";

            const productsDOM = document.createElement("div");
            productsDOM.textContent = `${products.productName}, amount: ${products.amount}, price: ${products.price}$`;
            productsDOM.style.placeContent = "center";

            const imageProductDOM = document.createElement("img");
            imageProductDOM.src = products.imageProduct;
            imageProductDOM.style.width = "100px";
            imageProductDOM.style.height = "60px";
            imageProductDOM.style.margin = "10px";

            const buttonAddToCart = document.createElement("button");
            buttonAddToCart.textContent = "ADD";
            buttonAddToCart.style.margin = "10px";
            buttonAddToCart.onclick = () => {
                addToCart(products.productName, parseFloat(products.price), products.amount, products.imageProduct);
            }
            productsDOM.appendChild(buttonAddToCart);
            if (products.amount == 0) {
                productsDOM.remove();
                deleteProduct$(products.id);
            }
            else {
                listProductDOM.appendChild(productDivDOM);
                productDivDOM.appendChild(imageProductDOM);
                productDivDOM.appendChild(productsDOM);
            }
        });
    } catch (error) {
        console.log("loading list Product error: ", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

function accountsManager() {
    const ownerAccount = userLogedIn.user.role;
    if (ownerAccount == "OWNER") {
        accountsManagerButtonDOM.style.display = "block";
        return;
    } else {
        accountsManagerButtonDOM.style.display = "none";
        return;
    }
}


window.productsManager = function productsManager() {
    window.location.href = `../../adminPage/managerPage/producctManager/productManager.html${postCartIDToParam(userLogedIn.cartID)}`
}
window.accountsManager = function accountsManager() {
    window.location.href = `../../adminPage/managerPage/accountManager/accountManager.html${postCartIDToParam(userLogedIn.cartID)}`;
}
function isAdminAccountLogedIn() {
    const adminAccount = userLogedIn.user.role
    if (adminAccount == "USERADMIN" || adminAccount == "OWNER") {
        productsManagerButtonDOM.style.display = "block";
    }
    else {
        productsManagerButtonDOM.style.display = "none";
    }
}

async function addToCart(nameProductDOM, priceProductDOM, amountProductDOM, imageProductDOM) {
    try {
        showLoading('loadingScreen');
        const createAt = new Date();
        if (userLogedIn && userLogedIn.products && userLogedIn.products.length > 0) {
            const product = productExistedInCart(nameProductDOM);
            if (product) {
                if (product.amount >= amountProductDOM) {
                    window.alert("You reach to limited amount of product");
                    return;
                }
                else {
                    product.amount += 1;
                    userLogedIn.totalPrice += product.price;
                }
            }
            else {
                userLogedIn.products.push({
                    productName: nameProductDOM,
                    amount: 1,
                    price: priceProductDOM,
                    imageProduct: imageProductDOM
                });
            };
            console.log(userLogedIn, "Cart VAlue");
            const updatedCart = await addProductToCartId(getUserIDInParam, userLogedIn);
            if (updatedCart) {
                userLogedIn = updatedCart;
                hideLoading('loadingScreen');
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
                imageProduct: imageProductDOM
            })
            cartValue.totalPrice += priceProductDOM;
            const updatedCart = await addProductToCartId(getUserIDInParam, cartValue);
            console.log(cartValue, "Cart VAlue");
            if (updatedCart) {
                userLogedIn = updatedCart;
                hideLoading('loadingScreen');
            }
        }
    } catch (error) {
        console.error(error);
    }
}



function productExistedInCart(nameProductDOM) {
    return userLogedIn.products.find((product_) => product_.productName == nameProductDOM);
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
