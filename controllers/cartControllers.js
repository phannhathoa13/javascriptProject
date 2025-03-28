const cartApiUrl = ("https://67701d46b353db80c3246245.mockapi.io/api/carts");
async function fetchCartFromApi() {
    try {
        const reponse = await fetch(cartApiUrl);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch cart error: ${error}`);
    }
}
async function fetchCartFromUserLogedIn(userID) {
    try {
        const reponse = await fetch(`${cartApiUrl}/${userID}`);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }
}


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
        console.error(`register cart error: `, error);
    }
}

async function addProductToCartId(cartID, cartValue) {
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
        console.error(`add product To Cart User error : `, error);
    }
}


async function updateCartInAccount(cartID, userLogedIn, updatedProduct, updatedTotalPrice) {
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
            })
        })
        return await reponse.json();
    } catch (error) {
        console.log(`update new Value In User Cart error:`, error);
    }
}

async function updateCart$(cartID, userInfor, cartInfor) {
    try {
        const reponse = await fetch(`${cartApiUrl}/${cartID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userInfor,
                products: cartInfor.products,
                totalPrice: cartInfor.totalPrice,
                createdAt: cartInfor.createdAt,
                cartID: cartInfor.cartID
            })
        })
        return await reponse.json();
    } catch (error) {
        console.log(`update new Value In User Cart error:`, error);
    }
}

async function removeCart$(cartID) {
    try {
        const reponse = await fetch(`${cartApiUrl}/${cartID}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await reponse.json();
    } catch (error) {
        console.error(`remove account error: ${error}`);
    }
}



export { registerCartUser, removeCart$, fetchCartFromUserLogedIn, addProductToCartId, fetchCartFromApi, updateCartInAccount, updateCart$ }
