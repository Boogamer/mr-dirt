const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const Properties = sequelize.define('properties', {
    key: { type: Sequelize.STRING, unique: true },
    value: { type: Sequelize.STRING }
});
Properties.sync().then(m => {
    Properties.findOne({ where: { key: "MUTE_ROLE_NAME" } }).then(result => {
        if (result == null) {
            Properties.create({ key: "MUTE_ROLE_NAME", value: "🤫" })
        }
    });
    Properties.findOne({ where: { key: "MUTE_ROLE_ID" } }).then(result => {
        if (result == null) {
            Properties.create({ key: "MUTE_ROLE_ID", value: "" })
        }
    });
    /*
    Properties.findAll().then(result => {
        console.dir(result);
    });
    */
});


const Mutes = sequelize.define('mutes', {
    guildId: { type: Sequelize.STRING },
    guildMemberId: { type: Sequelize.STRING },
    channelId: { type: Sequelize.STRING },
    endDateTime: { type: Sequelize.STRING }
});

module.exports = {
    properties: Properties
};