const notificationApi = ("https://67701d46b353db80c3246245.mockapi.io/api/notification");
async function fetchNotificationList() {
    try {
        const reponse = await fetch(notificationApi);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch cart error: ${error}`);
    }
}

async function createNotification$(informations) {
    try {
        const reponse = await fetch(`${notificationApi}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUser: informations.idUser,
                type: informations.type,
                data: informations.data,
                createdAt: informations.createdAt,
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`register cart error: `, error);
    }
}

export { fetchNotificationList, createNotification$ };