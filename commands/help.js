const utils = require("./../fwk/utils.js");
const commands = require("./../fwk/commands.js");

const commandName = "md-help";

module.exports = {
    name: commandName,
    description: "Menu d'aide",
    format: `"${commandName}"`,
    execute(client, message, args) {
        let helpMessage = this.description + "\n";
        for (var attr in commands) {
            const command = commands[attr];
            helpMessage += "- " + command.description + " : " + command.format + "\n";
        }
        message.channel.send(helpMessage);
    }
}