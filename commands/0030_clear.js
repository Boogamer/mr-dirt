const Fwk = require("./../fwk.js");

const commandName = Fwk.getCommandName("clear");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Supprimer une liste de messages",
    format: `${commandName} <NUMBER>`,
    isValid(client, message, args) {
        const number = parseInt(args[0], 10);
        return !isNaN(number);
    },
    execute(client, message, args) {
        const number = parseInt(args[0], 10);
        if (number > 100) {
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: `:x: Tu ne peux pas supprimer plus de 100 messages.`
                }
            });
        }
        message.delete().then(msg => {
            message.channel.bulkDelete(number).then(messages => {
                message.channel.send({
                    embed: {
                        color: 0x2ecc71,
                        title: `:white_check_mark: J'ai supprimé ${messages.size} message${messages.size > 1 ? "s" : ""}.`
                    }
                }).then(message => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000)
                }).catch(console.error);
            }).catch((e) => {
                if (e.code == "50034") {
                    message.channel.send({
                        embed: {
                            color: 0xff0000,
                            title: `:x: Je ne peux pas supprimer en masse des messages qui ont plus de 14 jours.`
                        }
                    });
                } else {
                    console.error(e);
                }
            });
        }).catch(console.error);
    }
}