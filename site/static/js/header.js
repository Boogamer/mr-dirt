document.addEventListener("DOMContentLoaded", function (event) {
    window.logout = function () {
        fetch("/logout").then(res => res.json()).then(response => {
            window.location = "/";
        }).catch(console.error);
    }
});