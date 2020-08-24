const fwk = require(__dirname + "/bot/fwk.js");

module.exports = {
    init() {
        return new Promise((resolve, reject) => {
            fwk.init({
                commandPrefix: "&",
                i18nPath: __dirname + "/common/i18n",
                modelsPath: __dirname + "/common/models",
                commandsPath: __dirname + "/bot/commands",
                daemonsPath: __dirname + "/bot/daemons"
            }).then(client => {
                client.on("ready", () => {
                    console.log(`Logged in as "${client.user.tag}"`);
                    resolve(client);
                });
                client.on("message", message => {
                    fwk.moderate(message);
                    fwk.checkCommand(message);
                });
                client.login(process.env.BOT_TOKEN);
            });
        });
    }
};