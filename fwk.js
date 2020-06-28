const fs = require("fs");
const Discord = require("discord.js");
const moderation = require("./assets/moderation.json");

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
    moderate(message) {
        if (!message.member.roles.highest.permissions.has("ADMINISTRATOR")) {
            for (let type in moderation) {
                const moderationType = moderation[type];
                const words = [];
                moderationType.list.forEach(word => {
                    if (message.content.toLowerCase().indexOf(word) !== -1) {
                        words.push(word);
                    }
                });
                if (words.length > 0) {
                    this._sendModerationWarning(message, words, moderationType);
                }
            }
        }
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
    checkCommand(message) {
        let logMessage = null;
        if (message.content.indexOf(this._initParams.commandPrefix) === 0) {
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
    },
    _sendModerationWarning(message, words, moderationType) {
        const moderationMessage = {
            color: moderationType.color,
            title: "Avertissement",
            fields: [
                { name: "Nom de l'utilisateur", value: message.author.username },
                { name: "Raison", value: `Usage mot interdit(s) "${words}"` }
            ],
            thumbnail: {
                url: message.author.avatarURL(),
            },
        }
        message.channel.send({ embed: moderationMessage });
    },
    _loadCommands(path) {
        fs.readdirSync(path).forEach(file => {
            console.log(`chargement commande "${file}"`);
            const command = require(this._initParams.commandsPath + "/" + file);
            this._commands[command.name] = command;
        });
    }
};