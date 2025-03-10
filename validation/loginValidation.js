const validationUsername = (usernameInput) => {
    return /^[a-zA-Z0-9_!@#$%^&;,./]+.{4,}$/.test(usernameInput);
}
const validationPassword = (passwordInput) => {
    return /^(?=.*[a-zA-Z0-9])(?=.*[A-Z])(?=.*[!@#$%^&]).{8,}$/.test(passwordInput);
}
const validationEmail = (emailInput) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
}
export { validationUsername, validationPassword, validationEmail };