const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    _initParams: null,
    _commands: {},
    _client: new Discord.Client(),
    init(params) {
        return new Promise((resolve, reject) => {
            this._initParams = params;
            if (process.env.NODE_ENV !== "production") {
                require("dotenv").config();
            }
            if (this._initParams.commandsPath) {
                this._loadCommands(this._initParams.commandsPath);
            }
            this._client.on("ready", () => {
                console.log(`Logged in as ${this._client.user.tag}!`);
            });
            resolve(this._client);
        });
    },
    getCommandName(name) {
        return this._initParams.commandPrefix + name;
    },
    getCommandsList() {
        const commands = [];
        for (var attr in this._commands) {
            commands.push(this._commands[attr])
        }
        return commands;
    },
    manageCommand(message) {
        let logMessage = null;
        const b = message.content.indexOf(this._initParams.commandPrefix) === 0;
        if (b) {
            const args = message.content.split(" ");
            const commandName = args.shift();
            const command = this._commands[commandName];
            if (command != null) {
                logMessage = `Execution de la commande "${commandName}" avec les paramètres "${args}"`;
                console.log(logMessage);
                if (command.isValid(this._client, message, args)) {
                    command.execute(this._client, message, args);
                } else {
                    logMessage = `Commande invalide, merci de respecter le format : "${command.format}"`;
                    console.log(logMessage);
                    message.channel.send(logMessage);
                }
            } else {
                logMessage = `Commande "${commandName}" non trouvée !`;
                console.log(logMessage);
            }
        }
        return b;
    },
    _loadCommands(path) {
        fs.readdirSync(path).forEach(file => {
            console.log(`chargement commande "${file}"`);
            const command = require(this._initParams.commandsPath + "/" + file);
            this._commands[command.name] = command;
        });
    }
};