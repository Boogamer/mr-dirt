const got = require("got");

module.exports = {
    init(app) {
        app.get("/guilds", function (req, res) {
            got("https://discordapp.com/api/users/@me/guilds", {
                headers: { "authorization": req.session.authorization },
                responseType: "json"
            }).then((result) => {
                const guilds = result.body;
                res.render("guilds", {
                    user: req.session.user,
                    list: guilds
                });
            });
        });
    }
}