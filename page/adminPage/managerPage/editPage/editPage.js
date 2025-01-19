
import { updateNewProductValueToApi } from "../../../../controllers/productControllers.js";
import Product from "../../../../models/product.js";
import { getValueInQuerryParam } from "../../../../routes/cartRoutes.js";

const getProductInParam = getValueInQuerryParam('product');
const getProductId = getValueInQuerryParam('productId')

const productNameInput = document.getElementById('productName');
const amountInput = document.getElementById('amount');
const priceInput = document.getElementById('price');

productNameInput.value = getProductInParam.productName;
amountInput.value = getProductInParam.amount;
priceInput.value = getProductInParam.price;

document.getElementById('editValue').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const product = new Product(
        formData.get('productName'),
        formData.get('amount'),
        formData.get('price')
    )
    const listPrudctRespone = await updateNewProductValueToApi(getProductId, product);
    if (listPrudctRespone) {
        window.location.href = "../../managerPage/producctManager/productManager.html";

    }
})


