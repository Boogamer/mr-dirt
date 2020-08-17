const Discord = require("discord.js");

const Fwk = require(__dirname + "/../fwk.js");

const commandName = Fwk.getCommandName("ban");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Bannir un utilisateur",
    format: `${commandName} <USER> <opt. REASON>`,
    isValid(client, message, args) {
        return args.length >= 1 &&
            Fwk.isUserFromCommandArg(args[0]);
    },
    execute(client, message, args) {
        const parameters = args.slice();
        const userId = Fwk.getUserIdFromCommandArg(parameters.shift());
        const firstGuildMember = message.mentions.members.first();
        if (firstGuildMember == null) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Je ne peux bannir une personne inexistante sur ce serveur.`
                }
            });
        }
        if (firstGuildMember.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Je ne peux pas bannir un administrateur.`
                }
            });
        }
        let reason = parameters.join(" ").trim();
        if(reason == null || reason == "") {
            reason = "non spécifiée.";
        }
        if (firstGuildMember.id == userId) {
            if (firstGuildMember.user.bot) {
                this._banUser(firstGuildMember, reason, message);
            } else {
                firstGuildMember.user.send({
                    embed: {
                        color: 0xff0000,
                        title: `:thumbsdown: Tu as été banni du serveur ${message.guild.name}.`,
                        fields: [
                            { name: "Raison :", value: reason }
                        ],
                        thumbnail: {
                            url: message.guild.iconURL()
                        }
                    }
                }).then(m => {
                    this._banUser(firstGuildMember, reason, message);
                }).catch(console.error);
            }
        } else {
            return message.channel.send(Fwk.getIncorrectCommandFormat(this.format));
        }
    },
    _banUser(guildMember, reason, message) {
        guildMember.ban({ reason: reason }).then(m => {
            message.channel.send({
                embed: {
                    color: 0x2ecc71,
                    title: `:white_check_mark: ${guildMember.user.tag} a été banni du serveur.`
                }
            });
        }).catch(console.error);
    }
}