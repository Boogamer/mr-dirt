const Fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/locale", function (req, res) {
            const locale = req.query.value;
            req.session.user.selectedLocale = locale;
            Fwk.setLocale(locale);
            res.json({ result: "OK" });
        });
    }
}