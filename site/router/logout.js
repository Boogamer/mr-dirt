const got = require("got");

const Fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/logout", function (req, res) {
            Fwk.setAuthenticated(null, req)
            res.json({ result: "OK" });
        });
    }
}