import Product from '../../models/product.js';
import { fetchProductAPI, postProductToApi, deleteProductInAPI } from '../../controllers/productControllers.js';
const productsAPI = ("https://67701d46b353db80c3246245.mockapi.io/listUser/products");
const listProduct = await fetchProductAPI();
const listProductDOM = document.getElementById('listProduct');
displayProduct();
function displayProduct() {
    listProduct.forEach(products => {
        const productsDOM = document.createElement("div");
        const buttonRemoveDOM = document.createElement("button");
        const buttonEditDOM = document.createElement("button");

        productsDOM.textContent = `ID: ${products.id}, product: ${products.productName}, amount: ${products.amount}, price:$ ${products.price}`
        buttonEditDOM.textContent = "Edit";
        buttonRemoveDOM.textContent = "Delete";
        buttonEditDOM.onclick = () => {
            const newURL = postValueToParam(products.id, products);
            window.location.href = newURL;
        }
        buttonRemoveDOM.onclick = () => {
            deleteProductInAPI(products.id, productsAPI);
            productsDOM.remove();
        }
        productsDOM.appendChild(buttonEditDOM);
        productsDOM.appendChild(buttonRemoveDOM);
        listProductDOM.appendChild(productsDOM);
    });
}

document.getElementById('createProduct').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const products = new Product(
        formData.get('productName'),
        formData.get('amount'),
        formData.get('price')
    )
    postProductToApi(products, productsAPI).then(() => {
        location.reload();
    })
})
function postValueToParam(productID, product) {
    const productString = encodeURIComponent(JSON.stringify(product));
    const productValue = `../editPage/editPage.html?productID=${productID}&productValue=${productString}`;
    return productValue;
}
