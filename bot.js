const Fwk = require(__dirname + "/bot/fwk.js");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

Fwk.init({
    commandPrefix: "&",
    localesPath: __dirname + "/bot/locales",
    commandsPath: __dirname + "/bot/commands",
    daemonsPath: __dirname + "/bot/daemons",
    modelsPath: __dirname + "/bot/models"
}).then(client => {
    client.on("message", message => {
        Fwk.moderate(message);
        Fwk.checkCommand(message);
    });
    client.login(process.env.BOT_TOKEN);
});