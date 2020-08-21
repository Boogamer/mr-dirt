const fs = require("fs");
const express = require("express");
const exphbs = require("express-handlebars");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helpers = require('handlebars-helpers')();

module.exports = {
    _initParams: null,
    _hbs: null,
    _locale: "gb",
    _locales: [],
    _authenticated: false,
    _routeRequestedBeforeAuthentication: null,
    init(params) {
        return new Promise((resolve, reject) => {
            this._initParams = params;
            this._initLocales();
            this._initHbs();
            this._initApp();
            this._initRoutes();
            resolve(this._app);
        });
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
    _initApp() {
        this._app = express();
        this._app.use(express.static(this._initParams.staticPath));
        this._app.use(compression());
        this._app.use(cookieParser());
        this._app.use(session({
            secret: process.env.SITE_SESSION_SECRET_KEY,
            resave: false,
            saveUninitialized: false
        }));
        this._app.set("views", this._initParams.viewsPath);
        this._app.engine("hbs", this._hbs.engine);
        this._app.set("view engine", "hbs");
    },
    _initRoutes() {
        fs.readdirSync(this._initParams.routesPath).forEach(file => {
            console.log(`Chargement route "${file}"`);
            const route = require(this._initParams.routesPath + "/" + file);
            route.init(this._app);
        });
    },
    _initHbs() {
        this._hbs = exphbs.create({
            extname: ".hbs",
            layoutsDir: this._initParams.viewsPath + "/layouts",
            partialsDir: this._initParams.viewsPath + "/partials",
            helpers: {
                label: (key, params) => {
                    return this.getLabel(key, params);
                }
            }
        });
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