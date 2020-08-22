const got = require("got");

const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/guilds", function (req, res) {
            if (fwk.checkRoute("/guilds", true, res, req)) {
                got("https://discordapp.com/api/users/@me/guilds", {
                    headers: { "authorization": req.session.authorization },
                    responseType: "json"
                }).then((result) => {
                    res.render("guilds", {
                        list: result.body,
                        activeMenu: "guilds"
                    });
                });
            }
        });
    }
}