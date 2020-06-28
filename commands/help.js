const Fwk = require("./../fwk.js");

const commandName = Fwk.getCommandName("help");

module.exports = {
    name: commandName,
    description: "Menu d'aide",
    format: `"${commandName}"`,
    isValid(client, message, args) {
        return true;
    },
    execute(client, message, args) {
        let helpMessage = this.description + "\n";
        Fwk.getCommandsList().forEach(command => {
            helpMessage += "- " + command.description + " : " + command.format + "\n";
        });
        message.channel.send(helpMessage);
    }
}