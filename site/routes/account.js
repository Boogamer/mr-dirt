const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/account", function (req, res) {
            if (fwk.checkRoute("/account", true, res, req)) {
                res.render("account", {
                    activeMenu: "account"
                });
            }
        });
    }
}