const fwk = require(__dirname + "/../fwk.js");

const commandName = fwk.getCommandName("rmrole");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Supprimer un rôle à un utilisateur",
    format: `${commandName} <ROLE> <USER> `,
    isValid(client, message, args) {
        return message.mentions.members.array().length > 0 &&
            message.mentions.roles.array().length > 0;
    },
    execute(client, message, args) {
        message.mentions.members.each(guildMember => {
            message.mentions.roles.each(role => {
                this._removeRole(message, guildMember, role);
            });
        });
    },
    _removeRole(message, guildMember, role) {
        if (!guildMember.roles.cache.has(role.id)) {
            return message.channel.send(`${guildMember} ne possède pas le rôle ${role}.`);
        }
        if (message.member.roles.highest.comparePositionTo(role) <= 0) {
            return message.channel.send(`Tu n'as pas la permission de supprimer le rôle ${role} à ${guildMember}.`);
        }
        if (role.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`Tu n'as pas la permission de supprimer le rôle ${role} à ${guildMember}.`);
        }
        guildMember.roles.remove(role)
            .then(m => {
                message.channel.send(`${guildMember} n'a plus le rôle ${role}.`);
            }).catch(console.error);
    }
}