const Fwk = require("./fwk.js");

Fwk.init({
    commandPrefix: "md-",
    commandsPath: "./commands"
}).then(client => {
    client.on("message", message => {
        if (!Fwk.manageCommand(message)) {
            // message "normal" à gérer !
        }
    });
    client.login(process.env.TOKEN);
});