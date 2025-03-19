const massageHistoryApi = ("https://67701d46b353db80c3246245.mockapi.io/api/massageHistory");

async function fetctMassageHistory() {
    try {
        const reponse = await fetch(massageHistoryApi);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch cart error: ${error}`);
    }
}
async function sendMassage$(massageText) {
    try {
        const reponse = await fetch(massageHistoryApi, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userSendMassage: massageText.userSendMassage,
                massage: massageText.massage,
                userReciveMassage: massageText.userReciveMassage,
                messageAt: massageText.messageAt
            })
        });
        return await reponse.json();
    } catch (error) {
        console.log("Create order error: ", error);
    }
}

export { fetctMassageHistory, sendMassage$ }
