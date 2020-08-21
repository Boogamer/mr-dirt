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
    _locales: [],
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
        if (private && req.session.user == null) {
            req.session.routeRequestedBeforeAuthentication = route;
            res.redirect("https://discord.com/api/oauth2/authorize?client_id=739490722151137330&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify%20email%20guilds");
            return false;
        }
        return true;
    },
    setAuthenticated(user, req, res) {
        if (user != null) {
            req.session.user = user;
            req.session.locale = user.locale;
            if (user.locale.indexOf("-") != -1) {
                req.session.locale = user.locale.split("-")[1].toLowerCase();
            }
        } else {
            req.session.destroy((err) => {
                console.error(err);
            });
        }
        return req.session.routeRequestedBeforeAuthentication;
    },
    getLabel(key, params, options) {
        const locale = options.data.root._locals.session?.locale || "gb";
        if (this._locales[locale][key] == null) {
            return key;
        }
        let value = this._locales[locale][key];
        params.split("|").forEach((param, index) => {
            value.replace("{" + index + "}", param);
        });
        return value;
    },
    _initApp() {
        this._app = express();
        this._app.use(express.static(this._initParams.staticPath));
        this._app.use(compression());
        this._app.use(cookieParser());
        const sess = {
            secret: process.env.SITE_SESSION_SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: {}
        }
        if (process.env.NODE_ENV === "production") {
            app.set("trust proxy", 1);
            sess.cookie.secure = true;
        }
        this._app.use(session(sess));
        this._app.use(function (req, res, next) {
            res.locals.session = req.session;
            next();
        });
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
        const that = this;
        this._hbs = exphbs.create({
            extname: ".hbs",
            layoutsDir: this._initParams.viewsPath + "/layouts",
            partialsDir: this._initParams.viewsPath + "/partials",
            helpers: {
                label: function(key, params, options) {
                    return that.getLabel(key, params, options);
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