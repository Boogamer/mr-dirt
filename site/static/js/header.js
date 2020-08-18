document.addEventListener("DOMContentLoaded", function (event) {
    window.logout = function () {
        fetch("/logout").then(res => res.json()).then(response => {
            window.location = "/";
        }).catch(console.error);
    }
    window.setLocale = function (locale) {
        fetch("/locale?value=" + locale).then(res => res.json()).then(response => {
            window.location.reload();
        }).catch(console.error);
    }
});