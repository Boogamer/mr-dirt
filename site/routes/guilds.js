const got = require("got");

const Fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/guilds", function (req, res) {
            if (Fwk.checkRoute("/guilds", true, res, req)) {
                got("https://discordapp.com/api/users/@me/guilds", {
                    headers: { "authorization": req.session.authorization },
                    responseType: "json"
                }).then((result) => {
                    const guilds = result.body;
                    res.render("guilds", {
                        list: guilds,
                        activeMenu: "guilds"
                    });
                });
            }
        });
    }
}