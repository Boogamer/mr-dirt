const utils = require("./../fwk/utils.js");

const commandName = "md-addrole";

module.exports = {
    name: commandName,
    description: "Ajouter un rôle à un utilisateur",
    format: `"${commandName} <ROLE_NAME> <USER>"`,
    execute(client, message, args) {
        if (args.length != 2) {
            return message.channel.send("Commande invalide, merci de respecter le format : " + this.format);
        }
        const roleName = args[0];
        const roleTo = message.mentions.members.first();
        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (role) {
            if (roleTo.roles.cache.has(role.id)) {
                return message.channel.send(`${roleTo.user.username} a déjà ce rôle !`);
            }
            if (role.permissions.has("KICK_MEMBERS")) {
                return message.channel.send("Tu n'as pas la permission de donner ce rôle !");
            }
            roleTo.roles.add(role)
                .then(m => message.channel.send(`${roleTo.user.username} possède maintenant le rôle ${role}.`))
                .catch(e => console.error(e));
        } else {
            message.channel.send("le rôle n'existe pas!");
        }
    }
}