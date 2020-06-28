const Fwk = require("./../fwk.js");

const commandName = Fwk.getCommandName("clearmsg");

module.exports = {
    name: commandName,
    description: "Supprimer une liste de messages",
    format: `${commandName} <NUMBER>`,
    isValid(client, message, args) {
        const number = parseInt(args[0], 10);
        return !isNaN(number);
    },
    execute(client, message, args) {
        if (!message.member.roles.highest.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`Tu n'as pas la permission d'utiliser cette commande.`);
        }
        const number = parseInt(args[0], 10);
        if (number > 100) {
            return message.channel.send(`Tu ne peux pas supprimer plus de 100 messages.`);
        }
        message.delete()
            .then(msg => {
                message.channel.bulkDelete(number)
                    .then(messages => {
                        message.channel.send(`J'ai supprimé ${messages.size} message(s).`)
                            .then(message => {
                                setTimeout(() => {
                                    message.delete();
                                }, 3000)
                            }).catch(console.error);
                    }).catch(console.error);
            }).catch(console.error);
    }
}