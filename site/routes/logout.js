const got = require("got");

const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/services/logout", function (req, res) {
            fwk.setAuthenticated(null, req)
            res.json({ result: "OK" });
        });
    }
}