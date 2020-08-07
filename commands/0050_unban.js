const Fwk = require("./../fwk.js");

const commandName = Fwk.getCommandName("unban");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Debannir un utilisateur",
    format: `${commandName} <USER>`,
    isValid(client, message, args) {
        return args.length == 1 &&
            Fwk.isUserFromCommandArg(args[0]);
    },
    execute(client, message, args) {
        const userId = Fwk.getUserIdFromCommandArg(args[0]);
        message.guild.fetchBans().then(banlist => {
            let found = false;
            banlist.each(baninfo => {
                if (baninfo.user.id == userId) {
                    message.guild.members.unban(userId).then(m => {
                        return message.channel.send({
                            embed: {
                                color: 0x2ecc71,
                                title: `:white_check_mark: ${baninfo.user.username}#${baninfo.user.discriminator} a été debanni du serveur.`
                            }
                        });
                    }).catch(console.error);
                    found = true;
                }
            })
            if (!found) {
                return message.channel.send({
                    embed: {
                        color: 0xff0000,
                        title: `:x: Je ne peux pas debannir une personne qui ne se trouve pas sur la liste des bannissements.`
                    }
                });
            }
        }).catch(console.error);
    }
}