// Variables d'environnement
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Chargement des commandes
const commands = require("./fwk/commands.js");
const commandsPath = "./commands";
const fs = require("fs");
fs.readdirSync(commandsPath).forEach(file => {
    console.log(`chargement commande "${file}"`);
    const command = require(commandsPath + "/" + file);
    commands[command.name] = command;
});

// Initialisation du client Discord
const Discord = require("discord.js");
const client = new Discord.Client();

// Gestion des évènements Discord
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", msg => {
    if (msg.content.indexOf("md-") === 0) {
        const cmd_array = msg.content.split(" ");
        const commandName = cmd_array.shift();
        const command = commands[commandName];
        if (command != null) {
            console.log(`Execution de la commande "${commandName}" avec les paramètres "${cmd_array}"`);
            command.execute(client, msg, cmd_array);
        } else {
            console.log(`Commande "${commandName}" non trouvée !`);
        }
    }
});

// Connexion du bot
client.login(process.env.TOKEN);