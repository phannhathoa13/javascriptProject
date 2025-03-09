import { addProductToCartId, fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { fetchListOrder } from "../../../controllers/orderControllers.js";
import { deleteProduct$, fetchProductAPI } from "../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../feautureReuse/loadingScreen.js";
import Cart from "../../../models/cartModels.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../routes/cartRoutes.js";
const listProducts = await fetchProductAPI();
const listOrder = await fetchListOrder();

const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);
displayListProduct();
checkRoleUserLogedIn();
filterMostPurchasedProducts();
function findTopSellingProducts() {
    const listProductsInOrder = [];

    listOrder.forEach((orders) => {
        orders.cartList.forEach((products) => {
            listProductsInOrder.push({
                productName: products.productName,
                amount: products.amount,
                price: products.price,
                imageProduct: products.imageProduct
            })
        })
    })

    const updatedListOrder = [];

    listProductsInOrder.forEach((products) => {
        const productsExisted = updatedListOrder.find((products_) => products_.productName == products.productName);
        if (productsExisted) {
            productsExisted.amount += products.amount;
        }
        else {
            updatedListOrder.push(products);
        }
    })
    const sortedProducts = updatedListOrder.sort((a, b) => b.amount - a.amount);
    return sortedProducts.splice(0, 3);
}

function filterMostPurchasedProducts() {
    const topSellingProducts = findTopSellingProducts();
    return listProducts.filter((products) => {
        const productsExisted = topSellingProducts.find((products_) => products_.productName == products.productName);
        if (productsExisted) {
            return products.productName != productsExisted.productName
        }
        return products
    })
}


async function displayListProduct() {
    try {
        showLoading('loadingScreen');
        const topSellingProducts = findTopSellingProducts();
        const nonTopSellingProducts = filterMostPurchasedProducts();

        topSellingProducts.forEach((products) => {
            const bestSellerString = document.createElement("span");
            bestSellerString.textContent = "(Best Seller)";
            bestSellerString.style.color = "#FFA500";
            bestSellerString.style.margin = "0 5px";

            const amountAndPriceInfor = document.createElement("span");
            amountAndPriceInfor.textContent = `Amount: ${products.amount}, Price: ${products.price}$`;

            const productInforDOM = document.createElement("div");
            productInforDOM.textContent = `Product: ${products.productName}`;
            productInforDOM.style.placeContent = "center";

            productInforDOM.appendChild(bestSellerString);
            productInforDOM.appendChild(amountAndPriceInfor);

            displayProductsDOM(products, productInforDOM);
        })

        nonTopSellingProducts.forEach((products) => {
            const productInforDOM = document.createElement("div");
            productInforDOM.textContent = `Product: ${products.productName}, Amount: ${products.amount}, Price: ${products.price}$`;
            productInforDOM.style.placeContent = "center";
            displayProductsDOM(products, productInforDOM);
        });

    } catch (error) {
        console.log("loading list Product error: ", error);
    }
    finally {
        hideLoading('loadingScreen');
    }
}

function displayProductsDOM(products, productInforDOM) {
    const listProductDOM = document.getElementById('listProduct');

    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.style.display = "inline-block";

    const productDivDOM = document.createElement("div");
    productDivDOM.style.display = "flex";

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
    productInforDOM.appendChild(buttonAddToCart);
    if (products.amount == 0) {
        productInforDOM.remove();
        deleteProduct$(products.id);
    }
    else {
        listProductDOM.appendChild(productDivDOM);
        productDivDOM.appendChild(imageProductDOM);
        productDivDOM.appendChild(productInforDOM);
    }
}

function checkRoleUserLogedIn() {
    const roleUserLogedIn = userLogedIn.user.role;

    const accountsManagerButtonDOM = document.getElementById('accountsManager');
    accountsManagerButtonDOM.style.display = "none";
    accountsManagerButtonDOM.style.margin = "0px"

    const productsManagerButtonDOM = document.getElementById('productsManager');
    productsManagerButtonDOM.style.margin = "5px";

    if (roleUserLogedIn == "OWNER") {
        accountsManagerButtonDOM.style.display = "inline-block";
        productsManagerButtonDOM.style.display = "inline-block";
        return;
    } if (roleUserLogedIn == "USERADMIN") {
        productsManagerButtonDOM.style.display = "inline-block";
    }
    else {
        accountsManagerButtonDOM.style.display = "none";
        productsManagerButtonDOM.style.display = "none";

        return;
    }
}

window.accountAndPermissons = function accountAndPermissons() {
    window.location.href = `../accountAndPermissions/accountAndPermissions.html${postCartIDToParam(userLogedIn.cartID)}`;
}

window.productsManager = function productsManager() {
    window.location.href = `../../adminPage/managerPage/producctManager/productManager.html${postCartIDToParam(userLogedIn.cartID)}`
}
window.accountsManager = function accountsManager() {
    window.location.href = `../../adminPage/managerPage/accountManager/accountManager.html${postCartIDToParam(userLogedIn.cartID)}`;
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
