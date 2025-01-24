const orderApi = ("https://67701d46b353db80c3246245.mockapi.io/api/order");
async function createOrder(userCart) {
    try {
        const reponse = await fetch(orderApi, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userCart.user,
                cartList: userCart.cartList,
                totalPrice: userCart.totalPrice,
                status: userCart.status,
                createdAt: userCart.createdAt
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`register cart error: `, error);
    }
}

async function fetchListOrder() {
    try {
        const reponse = await fetch(orderApi);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch cart error: ${error}`);
    }
}
export { createOrder, fetchListOrder };