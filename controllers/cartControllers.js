const cartApiUrl = ("https://67701d46b353db80c3246245.mockapi.io/api/carts");
async function registerCartUser(userLogedin) {
    try {
        const reponse = await fetch(`${cartApiUrl}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userLogedin.user,
                products: userLogedin.products,
                totalPrice: userLogedin.totalPrice,
                createdAt: userLogedin.createdAt,
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`Post error: `, error);
    }
}

async function addProductToCartContainerUser(cartID, cartValue) {
    try {
        const reponse = await fetch(`${cartApiUrl}/${cartID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: cartValue.user,
                products: cartValue.products,
                totalPrice: cartValue.totalPrice,
                createdAt: cartValue.createdAt
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`Post error: `, error);
    }
}

async function fetchCartFromApi() {
    try {
        const reponse = await fetch(cartApiUrl);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }
}
async function updateProductInApi(cartID, userLogedIn, updatedProduct, updatedTotalPrice) {
    try {
        const reponse = await fetch(`${cartApiUrl}/${cartID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userLogedIn.user,
                products: updatedProduct,
                totalPrice: updatedTotalPrice,
                createdAt: userLogedIn.createdAt,
                cartID: userLogedIn.cartID
                ,
            })
        })
        return await reponse.json();
    } catch (error) {
        console.log(error);
    }
}
export { registerCartUser, addProductToCartContainerUser, fetchCartFromApi, updateProductInApi }
