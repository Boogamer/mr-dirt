const fwk = require(__dirname + "/../fwk.js");

const commandName = fwk.getCommandName("clear");

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
        const firstGuildMember = message.mentions.members.first();
        message.delete().then(() => {
            this._getMessages(message.channel).then(allMessages => {
                const messagesToDelete = [];
                allMessages.forEach(message => {
                    if (messagesToDelete.length < number) {
                        if (firstGuildMember != null) {
                            if (message.author.id == firstGuildMember.id) {
                                messagesToDelete.push(message);
                            }
                        } else {
                            messagesToDelete.push(message);
                        }
                    }
                });
                message.channel.bulkDelete(messagesToDelete).then(messages => {
                    let msg = `:white_check_mark: J'ai supprimé ${messages.size} message${messages.size > 1 ? "s" : ""}.`;
                    if (firstGuildMember != null) {
                        msg = `:white_check_mark: J'ai supprimé ${messagesToDelete.length} message${messagesToDelete.length > 1 ? "s" : ""} de ${firstGuildMember.user.tag}.`;
                    }
                    message.channel.send({
                        embed: {
                            color: 0x2ecc71,
                            title: msg
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
            });
        }).catch(console.error);
    },
    async _getMessages(channel, limit = 3000) {
        const sum_messages = [];
        let last_id;
        while (true) {
            const options = { limit: 100 };
            if (last_id) {
                options.before = last_id;
            }
            const messages = await channel.messages.fetch(options);
            sum_messages.push(...messages.array());
            last_id = messages.last().id;
            if (messages.size != 100 || sum_messages >= limit) {
                break;
            }
        }
        return sum_messages;
    }
}