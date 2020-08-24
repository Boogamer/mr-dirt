const got = require("got");

const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/guilds", function (req, res) {
            if (fwk.checkRoute("/guilds", true, res, req)) {
                const botGuildIds = [];
                fwk.getBotClient().guilds.cache.map(guild => {
                    botGuildIds.push(guild.id);
                });
                got("https://discordapp.com/api/users/@me/guilds", {
                    headers: { "authorization": req.session.authorization },
                    responseType: "json"
                }).then((result) => {
                    result.body.forEach(guild => {
                        guild.installed = botGuildIds.indexOf(guild.id) != -1;
                    });
                    res.render("guilds", {
                        list: result.body,
                        activeMenu: "guilds"
                    });
                });
            }
        });
    }
}