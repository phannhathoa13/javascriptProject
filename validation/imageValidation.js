function isValidImageUrl(imgUrlData) {
    const httpsUrl = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)*\.(?:png|jpe?g|gif|bmp|webp)(?:\?.*)?$/i
    const base64String = /^data:image\/(?:png|jpe?g|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/
    return httpsUrl.test(imgUrlData) || base64String.test(imgUrlData)
}

export { isValidImageUrl}