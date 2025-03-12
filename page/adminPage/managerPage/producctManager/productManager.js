import { fetchCartFromUserLogedIn } from "../../../../controllers/cartControllers.js";
import {
    deleteProduct$,
    fetchProductAPI,
    createProduct,
} from "../../../../controllers/productControllers.js";
import { checkRoleUserLogedIn } from "../../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import Product from "../../../../models/product.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../../routes/cartRoutes.js";
import { postCartIDAndProductIDToParam } from "../../../../routes/productRoutes.js";
import { isValidImageUrl } from "../../../../validation/imageValidation.js";

const listProduct = await fetchProductAPI();
const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);

const createProductDOM = document.getElementById('createProduct');
createProductDOM.style.margin = "20px";

const listProductDOM = document.getElementById("listProduct");
const fileFather = document.getElementById('fileInput');
fileFather.style.display = "none";

const previewImgDOM = document.getElementById('previewImg');


let lastImgPreviewDOM = "";
checkRoleUserLogedIn(userLogedIn);
displayProduct();


function displayProduct() {
    listProduct.forEach((products) => {
        try {
            showLoading("loadingScreenDOM");
            const productDivDOM = document.createElement("div");
            productDivDOM.style.display = "flex";

            const imageProductDOM = document.createElement("img");
            imageProductDOM.src = products.imageProduct;
            imageProductDOM.style.width = "100px";
            imageProductDOM.style.height = "60px";

            const productsDOM = document.createElement("div");
            productsDOM.textContent = ` ID: ${products.id}, product: ${products.productName}, amount: ${products.amount}, price:$ ${products.price}`;
            productsDOM.style.placeContent = "center";

            const buttonEditDOM = document.createElement("button");
            buttonEditDOM.textContent = "Edit";
            buttonEditDOM.onclick = () => {
                window.location.href = `../editPage/editPage.html${postCartIDAndProductIDToParam(userLogedIn.cartID, products.id)}`;
            };

            const buttonRemoveDOM = document.createElement("button");
            buttonRemoveDOM.textContent = "Delete";
            buttonRemoveDOM.onclick = () => {
                productDivDOM.remove();
                deleteProduct$(products.id);
                setTimeout(() => {
                    window.alert("Removed Product!");
                    location.reload();
                }, 100);
            };
            productsDOM.appendChild(buttonEditDOM);
            productsDOM.appendChild(buttonRemoveDOM);
            productDivDOM.appendChild(imageProductDOM);
            productDivDOM.appendChild(productsDOM);
            listProductDOM.appendChild(productDivDOM);
        } catch (eror) {
            console.log("Display list product get error", eror);
        }
        finally {
            hideLoading("loadingScreenDOM");
        }
    });
}

document.getElementById("createProduct").addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
        showLoading("loadingScreenDOM");
        const file = fileFather.files[0];
        const previewImgString = previewImgDOM.src;
        const reader = new FileReader();
        if (!file && !lastImgPreviewDOM) {
            hideLoading("loadingScreenDOM");
            window.alert("You must choose a image for products");
            return;
        }
        else {
            if (file == undefined) {
                const product = createProductObject(previewImgString);
                if (validateValueInput(product)) {
                    await createProduct(product);
                    hideLoading("loadingScreenDOM");
                    setTimeout(() => {
                        window.alert("Created product");
                        location.reload();
                    }, 100);
                }
            }
            else {
                reader.readAsDataURL(file);
                reader.onload = async function () {
                    const base64String = reader.result;
                    const product = createProductObject(base64String);
                    if (!isValidImageUrl(base64String)) {
                        window.alert("Your image is not valid please try new one");
                        return;
                    }
                    if (!validateImageSize(file)) {
                        window.alert("Your image can't larger than 50KB");
                        return;
                    }
                    if (validateValueInput(product)) {
                        await createProduct(product);
                        hideLoading("loadingScreenDOM");
                        setTimeout(() => {
                            window.alert("Created Product");
                            location.reload();
                        }, 100);
                    }
                }
            }

        }
    } catch (error) {
        console.log("Create product get error", error);
    }
});

window.viewImage = function viewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = reader.result;
        if (!isValidImageUrl(base64String)) {
            window.alert("Your image is not valid please try new one");
            previewImgDOM.src = lastImgPreviewDOM;
            fileFather.value = "";
            return;
        }
        else if (!validateImageSize(file)) {
            window.alert("Your image can't larger than 50KB");
            previewImgDOM.src = lastImgPreviewDOM;
            fileFather.value = "";
            return;
        }
        else if (isImageProductExisted(base64String)) {
            window.alert("Your image is existed");
            previewImgDOM.src = lastImgPreviewDOM;
            fileFather.value = "";
            return;
        }
        else {
            previewImgDOM.src = reader.result;
            lastImgPreviewDOM = reader.result;
        }
    };
};

function createProductObject(base64String) {
    const formData = new FormData(document.getElementById("createProduct"));
    const product = new Product(
        formData.get("productName"),
        formData.get("amount"),
        formData.get("price"),
        base64String
    );
    return product
}

function validateValueInput(product) {
    const productExisted = getProductExisted(product.productName);
    const productNameValue = product.productName;
    const productAmount = product.amount;
    const productPrice = product.price;
    if (productExisted) {
        hideLoading("loadingScreenDOM");
        window.alert(`${productExisted.productNameValue} is existed`);
        return false;
    }
    else if (!productNameValue) {
        hideLoading("loadingScreenDOM");
        window.alert("Please enter the product name");
        return false;
    }
    else if (!validateProductNameInput(productNameValue)) {
        hideLoading("loadingScreenDOM");
        window.alert("The product name is not valid");
        return false;
    }
    else if (!productAmount) {
        hideLoading("loadingScreenDOM");
        window.alert("Please enter the product amount");
        return false;
    }
    else if (productAmount <= 0) {
        hideLoading("loadingScreenDOM");
        window.alert("The amount must bigger than 0");
        return false;
    }
    else if (!productPrice) {
        hideLoading("loadingScreenDOM");
        window.alert("Please enter the product price");
        return false;
    }
    else if (productPrice <= 0) {
        hideLoading("loadingScreenDOM");
        window.alert("The price must bigger than 0");
        return false;
    }
    else {
        return true;
    }
}

function validateProductNameInput(productNameInput) {
    return /\w+/g.test(productNameInput)
}

function isImageProductExisted(imageProductDOM) {
    return listProduct.some((products) => products.imageProduct == imageProductDOM)
}

function validateImageSize(file) {
    const maxSizeInBytes = 50 * 1024;
    if (file.size > maxSizeInBytes) {
        return false;
    }
    else {
        return true;
    }
}

function getProductExisted(productNameDOM) {
    return listProduct.find((products) => products.productName == productNameDOM);
}
window.logOut = function logOut() {
    window.location.href = "../../../userPage/loginPage/loginPage.html";
};

window.switchToShoppingPage = function switchToShoppingPage() {
    window.location.href = `../../../userPage/shoppingCart/shoppCart.html${postCartIDToParam(userLogedIn.cartID)}`;
}


window.chooseFile = function chooseFile() {
    document.getElementById('fileInput').click();
}

