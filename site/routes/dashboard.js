const got = require("got");

const fwk = require(__dirname + "/../fwk.js");

module.exports = {
    init(app) {
        app.get("/dashboard/:id", function (req, res) {
            if (fwk.checkRoute("/dashboard", true, res, req)) {
                fwk.getBotClient().guilds.fetch(req.params.id).then(guild => {
                    res.render("dashboard", {
                        detail: guild,
                        activeMenu: "guilds"
                    });
                }).catch(console.error);
            }
        });
    }
}