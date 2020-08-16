const fs = require("fs");
const Discord = require("discord.js");
const moderation = require("./assets/moderation.json");
const Sequelize = require('sequelize');

module.exports = {
    _initParams: null,
    _locales: {},
    _commands: {},
    _daemons: [],
    _sequelize: null,
    _client: new Discord.Client(),
    init(params) {
        return new Promise((resolve, reject) => {
            this._initParams = params;
            if (process.env.NODE_ENV !== "production") {
                require("dotenv").config();
            }
            if (this._initParams.localesPath) {
                this._loadLocales(this._initParams.localesPath);
            }
            if (this._initParams.modelsPath) {
                this._loadModels(this._initParams.modelsPath);
            }
            if (this._initParams.commandsPath) {
                this._loadCommands(this._initParams.commandsPath);
            }
            if (this._initParams.daemonsPath) {
                this._loadDaemons(this._initParams.daemonsPath);
            }
            this._client.on("ready", () => {
                console.log(`Logged in as ${this._client.user.tag}!`);
            });
            resolve(this._client);
        });
    },
    moderate(message) {
        if (message.member && !message.member.roles.highest.permissions.has("ADMINISTRATOR")) {
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
    getGuildMemberRoleById(guildMember, id) {
        let searchRole = null;
        guildMember.roles.cache.map(role => {
            if (role.id == id) {
                searchRole = role;
                return;
            }
        });
        return searchRole;
    },
    getGuildRoleById(guild, id) {
        let searchRole = null;
        guild.roles.cache.map(role => {
            if (role.id == id) {
                searchRole = role;
                return;
            }
        });
        return searchRole;
    },
    isUserFromCommandArg(id) {
        return id.indexOf("<@!") != -1 && id.indexOf(">") != -1;
    },
    getUserIdFromCommandArg(id) {
        return id.replace("<@!", "").replace(">", "");
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
    getIncorrectCommandFormat(commandFormat) {
        return `Commande invalide, merci de respecter le format : "${commandFormat}"`;
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
                    if (command.onlyAdmin) {
                        if (!message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                            return message.channel.send({
                                embed: {
                                    color: 0xff0000,
                                    title: `:x: Tu n'as pas la permission d'utiliser cette commande.`
                                }
                            });
                        }
                    }
                    try {
                        command.execute(this._client, message, args);
                    } catch(e) {
                        console.error(e);
                    }
                } else {
                    logMessage = this.getIncorrectCommandFormat(command.format);
                    console.log(logMessage);
                    message.channel.send(logMessage);
                }
            } else {
                logMessage = `Commande "${commandName}" non trouvée !`;
                console.log(logMessage);
            }
        }
    },
    getModel(modelName) {
        return this._sequelize.models[modelName];
    },
    _sendModerationWarning(message, words, moderationType) {
        message.channel.send({
            embed: {
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
        });
    },
    _loadLocales(path) {
        fs.readdirSync(path).forEach(file => {
            console.log(`Chargement locale "${file}"`);
            const locale = require(path + "/" + file);
            this._locales[file] = locale;
        });
    },
    _loadCommands(path) {
        fs.readdirSync(path).forEach(file => {
            console.log(`Chargement commande "${file}"`);
            const command = require(path + "/" + file);
            this._commands[command.name] = command;
        });
    },
    _loadDaemons(path) {
        fs.readdirSync(path).forEach(file => {
            console.log(`Chargement daemon "${file}"`);
            const daemon = require(path + "/" + file);
            this._daemons.push(daemon);
        });
        setInterval(() => {
            this._daemons.forEach(daemon => {
                daemon.tick(this._client);
            });
        }, 1000);
    },
    _loadModels(path) {
        this._sequelize = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: 'database.sqlite'
        });
        fs.readdirSync(path).forEach(file => {
            console.log(`Chargement model "${file}"`);
            const model = require(path + "/" + file);
            model.init(this._sequelize).sync(model.syncOptions).then(seqModel => {
                model.afterSync(seqModel);
            });
        });
    }
};