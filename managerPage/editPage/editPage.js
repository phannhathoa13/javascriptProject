import formProduct from "../../form/productForm.js";
import Product from "../../models/product.js";
import { editProduct } from "../../controllers/productControllers.js"
formProduct('eidtInput');
const productsAPI = ("https://67701d46b353db80c3246245.mockapi.io/listUser/products");

const param = getValueInParam();
const getProductIDInParam = JSON.parse(decodeURIComponent(param.get('productID')));
const getProductValueInParam = JSON.parse(decodeURIComponent(param.get('productValue')));

const productNameInput = document.getElementById('productName');
const amountInput = document.getElementById('amount');
const priceInput = document.getElementById('price');

if (productNameInput || amountInput || priceInput) {
    productNameInput.value = getProductValueInParam.productName;
    amountInput.value = getProductValueInParam.amount;
    priceInput.value = getProductValueInParam.price;
}
document.getElementById('editForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const product = new Product(
        formData.get('productName'),
        formData.get('amount'),
        formData.get('price')
    )
    editProduct(productsAPI, getProductIDInParam, product);
    window.location.href = "../../managerPage/producctManager/productManager.html";
})

function getValueInParam() {
    const param = new URLSearchParams(window.location.search);
    return param;
}


