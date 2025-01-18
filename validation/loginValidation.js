const validationUsername = (usernameInput) => {
    return /^[a-zA-Z0-9_!@#$%^&;,./]+$/.test(usernameInput);
}
const validationPassword = (passwordInput) => {
    return /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&]).{8,}$/.test(passwordInput);
}
export { validationUsername, validationPassword };