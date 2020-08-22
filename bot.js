const fwk = require(__dirname + "/bot/fwk.js");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

fwk.init({
    commandPrefix: "&",
    i18nPath: __dirname + "/common/i18n",
    modelsPath: __dirname + "/common/models",
    commandsPath: __dirname + "/bot/commands",
    daemonsPath: __dirname + "/bot/daemons"
}).then(client => {
    client.on("message", message => {
        fwk.moderate(message);
        fwk.checkCommand(message);
    });
    client.login(process.env.BOT_TOKEN);
});