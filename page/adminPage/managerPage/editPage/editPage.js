
import { fetchCartFromUserLogedIn } from "../../../../controllers/cartControllers.js";
import { fetchProductAPI, updateProduct } from "../../../../controllers/productControllers.js";
import { hideLoading, showLoading } from "../../../../feautureReuse/loadingScreen.js";
import Product from "../../../../models/product.js";
import { getValueInQuerryParam, postCartIDToParam } from "../../../../routes/cartRoutes.js";
import { isValidImageUrl } from "../../../../validation/imageValidation.js";


const listProduct = await fetchProductAPI();
const getProductInParam = getValueInQuerryParam('product');
const fileFather = document.getElementById('fileInput');
fileFather.style.display = "none";

const imageProductDOM = document.getElementById('previewImg');
imageProductDOM.style.margin = "5px";


const getUserIDInParam = getValueInQuerryParam('cartID');
let userLogedIn = await fetchCartFromUserLogedIn(getUserIDInParam);
let previusImage = "";

displayProductToInput();
function displayProductToInput() {
    try {
        showLoading("loadingScreenDOM");
        const inputFather = document.getElementById('inputContainer');
        inputFather.style.display = "flex";
        inputFather.style.alignItems = "center";

        const imageProductDOM = document.getElementById('previewImg');
        const productNameInput = document.getElementById('productName');
        const amountInput = document.getElementById('amount');
        const priceInput = document.getElementById('price');

        imageProductDOM.src = getProductInParam.imageProduct;
        productNameInput.value = getProductInParam.productName;
        amountInput.value = getProductInParam.amount;
        priceInput.value = getProductInParam.price;

        // previusImage = imageProductDOM.src;

    } catch (error) {
        console.log("display product get eroor", error);
    }
    finally {
        hideLoading("loadingScreenDOM");
    }
}

window.viewImage = function viewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const previewImgDOM = document.getElementById('previewImg');
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = reader.result;
        if (!isValidImageUrl(base64String)) {
            window.alert("Your image is not valid please try new one");
            fileFather.value = "";
            previewImgDOM.src = previusImage;
            return;
        }
        else if (!validateImageSize(file)) {
            window.alert("Your image can't larger than 75KB");
            fileFather.value = "";
            previewImgDOM.src = previusImage;
            return;
        }
        else if (isImageProductExisted(base64String)) {
            window.alert("Your image is existed");
            fileFather.value = "";
            previewImgDOM.src = previusImage;
            return;
        }
        else {
            previewImgDOM.src = reader.result;
            previusImage = reader.result;
        }
    };
};

document.getElementById('editValue').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        showLoading("loadingScreenDOM");
        const getProductId = getValueInQuerryParam('productId');
        const file = document.getElementById("fileInput").files[0];
        const imageDOM = imageProductDOM.src;
        const reader = new FileReader();
        if (!imageDOM) {
            window.alert("Please choose the image!");
            return;
        }
        else {
            if (file == undefined) {
                const product = createProductObject(imageDOM);
                if (validateInput(product)) {
                    await updateProduct(getProductId, product);
                    hideLoading("loadingScreenDOM");
                    setTimeout(() => {
                        window.alert("edit successed");
                        window.location.href = `../producctManager/productManager.html${postCartIDToParam(userLogedIn.cartID)}`;
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
                        window.alert("Your image can't larger than 75KB");
                        return;
                    }
                    if (isImageProductExisted(base64String)) {
                        window.alert("The image you already have");
                        return;
                    }
                    if (validateInput(product)) {
                        await updateProduct(getProductId, product);
                        hideLoading("loadingScreenDOM");
                        setTimeout(() => {
                            window.alert("edit successed");
                            window.location.href = `../producctManager/productManager.html${postCartIDToParam(userLogedIn.cartID)}`;;
                        }, 100);
                    }
                }
            }

        }
    } catch (error) {
        console.log("Edit product get error", error);
    }

})

function createProductObject(base64String) {
    const formData = new FormData(document.getElementById('editValue'));
    const product = new Product(
        formData.get('productName'),
        formData.get('amount'),
        formData.get('price'),
        base64String
    )
    return product
}

function validateInput(product) {
    const productExisted = getProductExisted(product.productName);
    const productNameDOM = product.productName;
    const productAmountDOM = product.amount;
    const productPriceDOM = product.price;
    if (!productNameDOM) {
        hideLoading("loadingScreenDOM");
        window.alert("Please enter the product name");
        return false;
    }
    else if (productExisted) {
        hideLoading("loadingScreenDOM");
        window.alert("The product name is existed");
        return false;
    }
    else if (!productAmountDOM) {
        hideLoading("loadingScreenDOM");
        window.alert("Please enter the product amount");
        return false;
    }
    else if (productAmountDOM <= 0) {
        hideLoading("loadingScreenDOM");
        window.alert("The amount must bigger than 0");
        return false;
    }
    else if (!productPriceDOM) {
        hideLoading("loadingScreenDOM");
        window.alert("Please enter the product Price");
        return false;
    }
    else if (productPriceDOM <= 0) {
        hideLoading("loadingScreenDOM");
        window.alert("The price must bigger than 0");
        return false;
    }
    else {
        hideLoading("loadingScreenDOM");
        return true;
    }
}



function validateImageSize(file) {
    const maxSizeInBytes = 75 * 1024;
    if (file.size > maxSizeInBytes) {
        return false;
    }
    else {
        return true;
    }
}

function getProductExisted(productNameOnInput) {
    return listProduct.find((products) => products.productName == productNameOnInput && products.id != getProductInParam.id)
}

function isImageProductExisted(imageInput) {
    return listProduct.some((products) => products.imageProduct == imageInput);
}

window.chooseFile = function chooseFile() {
    document.getElementById('fileInput').click();
}

