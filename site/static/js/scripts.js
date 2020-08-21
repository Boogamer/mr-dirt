document.addEventListener("DOMContentLoaded", function (event) {
    window.logout = function () {
        fetch("/services/logout").then(res => res.json()).then(response => {
            window.location = "/";
        }).catch(console.error);
    };
    window.setLocale = function (locale) {
        fetch("/services/locale?value=" + locale).then(res => res.json()).then(response => {
            window.location.reload();
        }).catch(console.error);
    };
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has("access_token")) {
        const accessToken = fragment.get("access_token");
        const tokenType = fragment.get("token_type");
        fetch("/services/login?tokenType=" + tokenType + "&accessToken=" + accessToken).then(res => res.json()).then(response => {
            window.location = response.routeRequestedBeforeAuthentication;
        }).catch(console.error);
    }
});