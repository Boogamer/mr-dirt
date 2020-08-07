const Fwk = require("./fwk.js");

Fwk.init({
    commandPrefix: "&",
    commandsPath: "./commands",
    daemonsPath: "./daemons"
}).then(client => {
    client.on("message", message => {
        Fwk.moderate(message);
        Fwk.checkCommand(message);
    });
    client.login(process.env.TOKEN);
});