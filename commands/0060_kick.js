const Fwk = require("./../fwk.js");

const commandName = Fwk.getCommandName("kick");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Expulser un utilisateur",
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
                    title: `:x: Je ne peux expulser une personne inexistante sur ce serveur.`
                }
            });
        }
        firstGuildMember.kick().then(m => {
            return message.channel.send({
                embed: {
                    color: 0x2ecc71,
                    title: `:white_check_mark: ${firstGuildMember.user.tag} a été expulsé du serveur.`
                }
            });
        });
    }
}