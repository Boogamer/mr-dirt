const got = require("got");

module.exports = {
    init(app) {
        app.get("/login", function (req, res) {
            req.session.authorization = `${req.query.tokenType} ${req.query.accessToken}`;
            got("https://discordapp.com/api/users/@me", {
                headers: { "authorization": req.session.authorization },
                responseType: "json"
            }).then((result) => {
                req.session.user = result.body;
                res.json({ result: "OK" });
            });
        });
    }
}