const Fwk = require("./fwk.js");

Fwk.init({
    commandPrefix: "&",
    localesPath: "./locales",
    commandsPath: "./commands",
    daemonsPath: "./daemons",
    modelsPath: "./models"
}).then(client => {
    client.on("message", message => {
        Fwk.moderate(message);
        Fwk.checkCommand(message);
    });
    client.login(process.env.TOKEN);
});