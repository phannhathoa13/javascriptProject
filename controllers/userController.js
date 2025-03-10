const userApiURL = ("https://67701d46b353db80c3246245.mockapi.io/api/users");
async function fetchUserAPI() {
    try {
        const reponse = await fetch(userApiURL);
        return await reponse.json()
    } catch (error) {
        console.error(`fetch list user error: ${error}`);
    }
}
async function registerAccountUser(user) {
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
        console.error(`create user account error: `, error);
    }
}

async function editAccount$(userID, user) {
    try {
        const reponse = await fetch(`${userApiURL}/${userID}`, {
            method: "PUT",
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
        console.error(`create user account error: `, error);
    }
}

async function editRoleAccount$(userID, user, role) {
    try {
        const reponse = await fetch(`${userApiURL}/${userID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                email: user.email,
                createdAt: user.createdAt,
                role: role
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`create user account error: `, error);
    }
}


async function removeAccount$(userID) {
    try {
        const reponse = await fetch(`${userApiURL}/${userID}/`, {
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






export { fetchUserAPI, removeAccount$, registerAccountUser, editAccount$, editRoleAccount$ };