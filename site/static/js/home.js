document.addEventListener("DOMContentLoaded", function (event) {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has("access_token")) {
        const accessToken = fragment.get("access_token");
        const tokenType = fragment.get("token_type");
        fetch("/login?tokenType=" + tokenType + "&accessToken=" + accessToken).then(res => res.json()).then(response => {
            window.location = "/";
        }).catch(console.error);
    }
});