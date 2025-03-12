const voucherAPI = ("https://67701d46b353db80c3246245.mockapi.io/api/voucher");

async function fetchListVoucher() {
    try {
        const reponse = await fetch(`${voucherAPI}`);
        return await reponse.json()
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }
}


async function createVoucher$(voucher) {
    try {
        const reponse = await fetch(`${voucherAPI}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                voucherID: voucher.voucherID,
                voucherName: voucher.voucherName,
                amount: voucher.amount,
                discount: voucher.discount,
                limitTime: voucher.limitTime,
                state: voucher.state,
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`register cart error: `, error);
    }
}
async function updateVoucher$(voucherID, voucher) {
    try {
        const reponse = await fetch(`${voucherAPI}/${voucherID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                voucherID: voucher.voucherID,
                voucherName: voucher.voucherName,
                amount: voucher.amount,
                discount: voucher.discount,
                limitTime: voucher.limitTime,
                state: voucher.state,
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`register cart error: `, error);
    }
}
async function removeVoucher$(voucherID) {
    try {
        const reponse = await fetch(`${voucherAPI}/${voucherID}/`, {
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

export { fetchListVoucher, createVoucher$, removeVoucher$, updateVoucher$ }