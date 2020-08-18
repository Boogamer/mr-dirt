const got = require("got");

module.exports = {
    init(app) {
        app.get("/logout", function (req, res) {
            req.session.authorization = undefined;
            req.session.user = undefined;
            res.json({ result: "OK" });
        });
    }
}