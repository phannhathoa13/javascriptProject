
import { deleteProductInAPI, fetchProductAPI, createProduct } from "../../../../controllers/productControllers.js";
import Product from "../../../../models/product.js";
import { postProductIdAndValueToParam } from "../../../../routes/productRoutes.js";

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
            const urlContainerProduct = postProductIdAndValueToParam(products.id, products);
            window.location.href = `../editPage/editPage.html${urlContainerProduct}`;
        }
        buttonRemoveDOM.onclick = () => {
            productsDOM.remove();
            deleteProductInAPI(products.id);
        }
        productsDOM.appendChild(buttonEditDOM);
        productsDOM.appendChild(buttonRemoveDOM);
        listProductDOM.appendChild(productsDOM);
    });
}

document.getElementById('createProduct').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const product = new Product(
        formData.get('productName'),
        formData.get('amount'),
        formData.get('price')
    )
    let productExisted = isProductExisted(product.productName)
    if (productExisted) {
        window.alert(`${productExisted.productName}, is existed, please try agian`);
        return;
    }
    else {
        const updatedProduct = await createProduct(product);
        if (updatedProduct) {
            location.reload();
            productExisted = updatedProduct
        }
    }
})

function isProductExisted(productNameDOM) {
    return listProduct.find((products) => products.productName == productNameDOM)
}
window.viewOrder = function viewOrder() {
    window.location.href = "../orderManager/orderManager.html"
}