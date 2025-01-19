function showLoading(string) {
    const loader = document.getElementById(string);
    if (loader) {
        loader.classList.remove("hide");
    }
}

function hideLoading(string) {
    const loader = document.getElementById(string);
    if (loader) {
        loader.classList.add("hide");
    }
}

export { showLoading, hideLoading }