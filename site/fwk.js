const fs = require("fs");

module.exports = {
    _locale: "gb",
    _locales: [],
    _authenticated: false,
    _routeRequestedBeforeAuthentication: null,
    init() {
        this._initLocales();
    },
    checkRoute(route, private, res, req) {
        if (private && !this._authenticated) {
            this._routeRequestedBeforeAuthentication = route;
            res.redirect("https://discord.com/api/oauth2/authorize?client_id=739490722151137330&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify%20email%20guilds");
            return false;
        }
        return true;
    },
    setAuthenticated(user, req, res) {
        if (user != null) {
            user.selectedLocale = user.locale;
            if (user.locale.indexOf("-") != -1) {
                user.selectedLocale = user.locale.split("-")[1].toLowerCase();
            }
            req.session.user = user;
            this.setLocale(user.selectedLocale);
            this._authenticated = true;
        } else {
            req.session.authorization = undefined;
            req.session.user = undefined;
            this._authenticated = false;
            this._routeRequestedBeforeAuthentication = null;
        }
        return this._routeRequestedBeforeAuthentication;
    },
    setLocale(locale) {
        this._locale = locale;
    },
    getLabel(key, params) {
        if (this._locales[this._locale][key] == null) {
            return key;
        }
        let value = this._locales[this._locale][key];
        if ((typeof params) == "string") {
            params.split("|").forEach((param, index) => {
                value.replace("{" + index + "}", param);
            });
        }
        return value;
    },
    _initLocales() {
        const localesPath = __dirname + "/static/locales";
        fs.readdirSync(localesPath).forEach(file => {
            console.log(`Chargement locale "${file}"`);
            const locale = require(localesPath + "/" + file);
            this._locales[file.split(".")[0]] = locale;
        });
    }
}