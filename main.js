const site = require(__dirname + "/site.js");
const bot = require(__dirname + "/bot.js");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

bot.init().then((client) => {
    site.init(client).then(() => {
    });
})