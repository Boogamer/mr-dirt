const Fwk = require(__dirname + "/site/fwk");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

Fwk.init({
    staticPath: __dirname + "/site/static",
    routesPath: __dirname + "/site/routes",
    viewsPath: __dirname + "/site/templates"
}).then(app => {
    app.listen(process.env.SITE_PORT);
});