const Discord = require("discord.js");

const fwk = require(__dirname + "/../fwk.js");

const commandName = fwk.getCommandName("help");

module.exports = {
    onlyAdmin: true,
    name: commandName,
    description: "Menu d'aide",
    format: `${commandName}`,
    isValid(client, message, args) {
        return true;
    },
    execute(client, message, args) {
        const icon = new Discord.MessageAttachment("./assets/icon.png");
        const fields = [];
        fwk.getCommandsList().forEach(command => {
            fields.push({ name: command.description, value: command.format });
        });
        const helpMessage = {
            color: 0x2ecc71,
            title: this.description,
            fields: fields,
            thumbnail: {
                url: "attachment://icon.png",
            }
        }
        message.channel.send({ files: [icon], embed: helpMessage });
    }
}