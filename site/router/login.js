const got = require("got");

const Fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/login", function (req, res) {
            req.session.authorization = `${req.query.tokenType} ${req.query.accessToken}`;
            got("https://discordapp.com/api/users/@me", {
                headers: { "authorization": req.session.authorization },
                responseType: "json"
            }).then((result) => {
                const user = result.body;
                user.selectedLocale = user.locale;
                if (user.locale.indexOf("-") != -1) {
                    user.selectedLocale = user.locale.split("-")[1].toLowerCase();
                }
                req.session.user = user;
                Fwk.setLocale(user.selectedLocale);
                res.json({ result: "OK" });
            });
        });
    }
}