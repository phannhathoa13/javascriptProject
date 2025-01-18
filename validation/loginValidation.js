const validationUsername = (usernameInput) => {
    return usernameInput = /^[a-zA-Z0-9_!@#$%^&;,./]+$/;
}
const validationPassword = (passwordInput) => {
    return passwordInput = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&]).{8,}$/;
}
export { validationUsername, validationPassword };