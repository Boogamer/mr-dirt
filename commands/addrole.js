const Fwk = require("./../fwk.js");

const commandName = Fwk.getCommandName("addrole");

module.exports = {
    name: commandName,
    description: "Ajouter un rôle à un utilisateur",
    format: `"${commandName} <ROLE> <USER>"`,
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
            return message.channel.send(`${guildMember} a déjà le rôle ${role}.`);
        }
        if (role.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`Je ne peux pas donner le rôle ${role} à ${guildMember}.`);
        }
        guildMember.roles.add(role)
            .then(m => message.channel.send(`${guildMember} possède maintenant le rôle ${role}.`))
            .catch(e => console.error(e));
    }
}