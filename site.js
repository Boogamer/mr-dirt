const express = require("express");
const exphbs = require("express-handlebars");
const compression = require("compression");
const fs = require("fs");

const VIEWS_DIRECTORY = __dirname + "/site/templates";
const STATIC_DIRECTORY = __dirname + "/site/static";
const ROUTER_DIRECTORY = __dirname + "/site/router";

const hbs = exphbs.create({
    extname: ".hbs",
    layoutsDir: VIEWS_DIRECTORY + "/layouts",
    partialsDir: VIEWS_DIRECTORY + "/partials"
});

const app = express();
app.use(express.static(STATIC_DIRECTORY));
app.use(compression());
app.set("views", VIEWS_DIRECTORY);
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

fs.readdirSync(ROUTER_DIRECTORY).forEach(file => {
    console.log(`Chargement route "${file}"`);
    const route = require(ROUTER_DIRECTORY + "/" + file);
    route.init(app);
});

app.listen(3000);