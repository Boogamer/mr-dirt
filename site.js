const express = require("express");
const exphbs = require("express-handlebars");
const compression = require("compression");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const Fwk = require(__dirname + "/site/fwk");

const VIEWS_DIRECTORY = __dirname + "/site/templates";
const STATIC_DIRECTORY = __dirname + "/site/static";
const ROUTER_DIRECTORY = __dirname + "/site/router";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const helpers = require('handlebars-helpers')();

const hbs = exphbs.create({
    extname: ".hbs",
    layoutsDir: VIEWS_DIRECTORY + "/layouts",
    partialsDir: VIEWS_DIRECTORY + "/partials",
    helpers: {
        label: function (key, params) {
            return Fwk.getLabel(key, params);
        }
    }
});

const app = express();
app.use(express.static(STATIC_DIRECTORY));
app.use(compression());
app.use(cookieParser());
app.use(session({
    secret: process.env.SITE_SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.set("views", VIEWS_DIRECTORY);
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

fs.readdirSync(ROUTER_DIRECTORY).forEach(file => {
    console.log(`Chargement route "${file}"`);
    const route = require(ROUTER_DIRECTORY + "/" + file);
    route.init(app);
});

Fwk.init();

app.listen(3000);