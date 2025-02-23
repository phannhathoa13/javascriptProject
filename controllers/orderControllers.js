const orderApi = ("https://67701d46b353db80c3246245.mockapi.io/api/order");


async function fetchListOrder() {
    try {
        const reponse = await fetch(orderApi);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch cart error: ${error}`);
    }
}
async function createOrder(cartUserLogedIn) {
    try {
        const reponse = await fetch(orderApi, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: cartUserLogedIn.user,
                cartList: cartUserLogedIn.cartList,
                totalPrice: cartUserLogedIn.totalPrice,
                status: cartUserLogedIn.status,
                createdAt: cartUserLogedIn.createdAt
            })
        });
        return await reponse.json();
    } catch (error) {
        console.log("Create order error: ", error);
    }
}
export { createOrder, fetchListOrder };