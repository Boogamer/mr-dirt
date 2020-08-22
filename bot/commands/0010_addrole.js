const fwk = require(__dirname + "/../fwk.js");

const commandName = fwk.getCommandName("addrole");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Ajouter un rôle à un utilisateur",
    format: `${commandName} <ROLE> <USER>`,
    isValid(client, message, args) {
        return message.mentions.members.array().length > 0 &&
            message.mentions.roles.array().length > 0;
    },
    execute(client, message, args) {
        message.mentions.members.each(guildMember => {
            message.mentions.roles.each(role => {
                this._addRole(message, guildMember, role);
            });
        });
    },
    _addRole(message, guildMember, role) {
        if (guildMember.roles.cache.has(role.id)) {
            return mmessage.channel.send({
                embed: {
                    color: 0x3b88c3,
                    title: `:x: ${guildMember} a déja le rôle ${role}.`
                }
            });
        }
        if (message.member.roles.highest.comparePositionTo(role) < 0) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Tu n'as pas la permission de donner le rôle ${role} à ${guildMember}.`
                }
            });
        }
        if (role.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`Tu n'as pas la permission de donner le rôle ${role} à ${guildMember}.`);
        }
        guildMember.roles.add(role)
            .then(m => {
                message.channel.send(`${guildMember} possède maintenant le rôle ${role}.`);
            }).catch(console.error);
    }
}