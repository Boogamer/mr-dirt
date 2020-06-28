const Fwk = require("./fwk.js");

Fwk.init({
    commandPrefix: "&",
    commandsPath: "./commands"
}).then(client => {
    client.on("message", message => {
        Fwk.moderate(message);
        Fwk.checkCommand(message);
    });
    client.login(process.env.TOKEN);
});