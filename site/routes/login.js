const got = require("got");

const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/services/login", function (req, res) {
            req.session.authorization = `${req.query.tokenType} ${req.query.accessToken}`;
            got("https://discordapp.com/api/users/@me", {
                headers: { "authorization": req.session.authorization },
                responseType: "json"
            }).then((result) => {
                const routeRequestedBeforeAuthentication = fwk.setAuthenticated(result.body, req);
                res.json({
                    result: "OK",
                    routeRequestedBeforeAuthentication: routeRequestedBeforeAuthentication
                });
            });
        });
    }
}