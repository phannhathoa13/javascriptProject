const roleAPI = "https://67701d46b353db80c3246245.mockapi.io/api/roles";

async function createRole$(roleInput) {
    try {
        const reponse = await fetch(roleAPI, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: roleInput.role,
                codeName: roleInput.codeName,
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`create user account error: `, error);
    }
}
async function fetchListRole() {
    try {
        const response = await fetch(roleAPI);
        return await response.json();
    } catch (error) {
        console.log("Fetch list role get error", error);
    }
}
export { fetchListRole, createRole$ }