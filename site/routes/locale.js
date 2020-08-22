const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/services/locale", function (req, res) {
            req.session.locale = req.query.value;
            res.json({ result: "OK" });
        });
    }
}