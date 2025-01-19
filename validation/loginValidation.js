const validationUsername = (usernameInput) => {
    return /^[a-zA-Z0-9_!@#$%^&;,./]+$/.test(usernameInput);
}
const validationPassword = (passwordInput) => {
    return /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&]).{8,}$/.test(passwordInput);
}
const validationEmail = (emailInput) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
}
export { validationUsername, validationPassword, validationEmail };