const Fwk = require("./../fwk.js");
const Discord = require("discord.js");

const commandName = Fwk.getCommandName("help");

module.exports = {
    name: commandName,
    description: "Menu d'aide",
    format: `${commandName}`,
    isValid(client, message, args) {
        return true;
    },
    execute(client, message, args) {
        const icon = new Discord.MessageAttachment("./assets/icon.png");
        const fields = [];
        Fwk.getCommandsList().forEach(command => {
            fields.push({ name: command.description, value: command.format });
        });
        const helpMessage = {
            color: 0x2ecc71,
            title: this.description,
            fields: fields,
            thumbnail: {
                url: "attachment://icon.png",
            },
        }
        message.channel.send({ files: [icon], embed: helpMessage });
    }
}