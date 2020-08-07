const Fwk = require("./../fwk.js");
const Discord = require("discord.js");
const Model = require("./../model.js");

const commandName = Fwk.getCommandName("mute");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Mute un utilisateur",
    format: `${commandName} <USER> <TIME>`,
    isValid(client, message, args) {
        return args.length == 2 &&
            Fwk.isUserFromCommandArg(args[0]);
    },
    execute(client, message, args) {
        const firstGuildMember = message.mentions.members.first();
        if (firstGuildMember == null) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Je ne peux mute une personne inexistante sur ce serveur.`
                }
            });
        }
        if (firstGuildMember.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Je ne peux pas mute un administrateur.`
                }
            });
        }
        Model.properties.findOne({ where: { key: "MUTE_ROLE_ID" } }).then(property => {
            const mutedRole = Fwk.getGuildRoleById(message.guild, property.value);
            if (mutedRole != null) {
                if (firstGuildMember.roles.cache.has(mutedRole.id)) {
                    return message.channel.send({
                        embed: {
                            color: 0xff0000,
                            title: `:x: Je ne peux pas mute quelqu'un qui ne peut déjà pas parler.`
                        }
                    });
                }
            }
            this._manageGuild(message, firstGuildMember, mutedRole);
        });
    },
    _manageGuild(message, guildMember, mutedRole) {
        Model.properties.findOne({ where: { key: "MUTE_ROLE_NAME" } }).then(property => {
            if (mutedRole == null) {
                message.guild.roles.create({
                    data: {
                        name: property.value,
                        permissions: []
                    }
                }).then(role => {
                    Model.properties.update({ value: role.id }, { where: { key: "MUTE_ROLE_ID" } });
                    mutedRole = role;
                    this._manageUser(message, guildMember, mutedRole);
                }).catch(console.error);
            } else {
                mutedRole.setPermissions([]).then(m => {
                    this._manageUser(message, guildMember, mutedRole);
                }).catch(console.error);
            }
        });
    },
    _manageUser(message, guildMember, mutedRole) {
        guildMember.roles.add(mutedRole).then(m => {
            this._manageChannels(message, guildMember, mutedRole);
        });
    },
    _manageChannels(message, guildMember, mutedRole) {
        message.guild.channels.cache.map(channel => {
            channel.overwritePermissions([
                { id: mutedRole.id, deny: ['SEND_MESSAGES'] }
            ]).then(m => {
                if (channel === message.guild.channels.cache.last()) {
                    this._sendChannelMessage(message, guildMember);
                }
            }).catch(console.error);
        });
    },
    _sendChannelMessage(message, guildMember) {
        message.channel.send({
            embed: {
                color: 0x2ecc71,
                title: `:white_check_mark: ${guildMember.user.tag} a été mute.`
            }
        });
    }
}