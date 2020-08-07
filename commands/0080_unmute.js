const Fwk = require("./../fwk.js");
const Model = require("./../model.js");

const commandName = Fwk.getCommandName("unmute");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Unmute un utilisateur",
    format: `${commandName} <USER>`,
    isValid(client, message, args) {
        return args.length == 1 &&
            Fwk.isUserFromCommandArg(args[0]);
    },
    execute(client, message, args) {
        const firstGuildMember = message.mentions.members.first();
        if (firstGuildMember == null) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Je ne peux unmute une personne inexistante sur ce serveur.`
                }
            });
        }
        Model.properties.findOne({ where: { key: "MUTE_ROLE_ID" } }).then(property => {
            const mutedRole = Fwk.getGuildRoleById(message.guild, property.value);
            if (mutedRole == null) {
                return message.channel.send({
                    embed: {
                        color: 0xff0000,
                        title: `:x: Je ne peux pas unmute ${firstGuildMember.user.tag} car il n'est pas mute.`
                    }
                });
            }
            const userMutedRole = Fwk.getGuildMemberRoleById(firstGuildMember, property.value);
            if (userMutedRole == null) {
                return message.channel.send({
                    embed: {
                        color: 0xff0000,
                        title: `:x: Je ne peux pas unmute ${firstGuildMember.user.tag} car il n'est pas mute.`
                    }
                });
            }
            firstGuildMember.roles.remove(mutedRole).then(m => {
                message.channel.send({
                    embed: {
                        color: 0x2ecc71,
                        title: `:white_check_mark: ${firstGuildMember.user.tag} a été unmute.`
                    }
                });
            });
        });
    }
}