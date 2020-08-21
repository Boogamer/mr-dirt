const Fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/account", function (req, res) {
            if (Fwk.checkRoute("/account", true, res, req)) {
                res.render("account", {
                    user: req.session.user,
                    activeMenu: "account"
                });
            }
        });
    }
}