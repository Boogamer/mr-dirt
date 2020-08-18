const fs = require("fs");

module.exports = {
    init(app) {
        app.get("/commands", function (req, res) {
            const commands = [];
            const commandsPath = __dirname + "/../../bot/commands"
            fs.readdirSync(commandsPath).forEach(file => {
                const command = require(commandsPath + "/" + file);
                commands.push(command);
            });
            res.render("commands", {
                user: req.session.user,
                list: commands,
                activeMenu: "commands"
            });
        });
    }
}