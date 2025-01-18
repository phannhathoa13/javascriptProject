const userApiURL = ("https://67701d46b353db80c3246245.mockapi.io/api/users");
async function fetchUserAPI() {
    try {
        const reponse = await fetch(userApiURL);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }
}
async function postUserToApi(user) {
    try {
        const reponse = await fetch(userApiURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                email: user.email,
                createdAt: user.createdAt,
                role: user.role
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`Post error: `, error);
    }
}


async function removeProductInCartFromUserAPI(userID, api) {
    try {
        const reponse = await fetch(`${api}/${userID}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await reponse.json();
    } catch (error) {
        console.error(`Delete error: ${error}`);
    }
}

async function editProductInCartUser(userLogedInID, productNameDOM, newValue) {
    try {
        const reponse = await fetch(`${userApiURL}/${userLogedInID}?productList&productName=&${productNameDOM}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productList: newValue
            })
        })
        return await reponse.json();
    } catch (error) {
        console.error(`Delete error: ${error}`);
    }
}
export { fetchUserAPI, editProductInCartUser, removeProductInCartFromUserAPI, postUserToApi };