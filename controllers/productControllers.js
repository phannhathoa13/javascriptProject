const productApiURL = ("https://67701d46b353db80c3246245.mockapi.io/api/products");
async function fetchProductAPI() {
    try {
        const reponse = await fetch(productApiURL);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch list Product error : ${error}`);
    }
}
async function createProduct(product) {
    try {
        const reponse = await fetch(productApiURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName: product.productName,
                amount: product.amount,
                price: product.price
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`Create product error: `, error);
    }
}
async function updateNewProductValueToApi(productID, product) {
    try {
        const reponse = await fetch(`${productApiURL}/${productID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName: product.productName,
                amount: product.amount,
                price: product.price
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`new product value is error: `, error);
    }
}
async function deleteProductInAPI(productID) {
    try {
        const reponse = await fetch(`${productApiURL}/${productID}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await reponse.json();
    } catch (error) {
        console.error(`Delete product error: ${error}`);
    }
}
export { fetchProductAPI, createProduct, updateNewProductValueToApi, deleteProductInAPI }