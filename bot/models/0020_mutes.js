const Sequelize = require('sequelize');

module.exports = {
    syncOptions: { force: true },
    init(sequelize) {
        return sequelize.define('mutes', {
            guildId: { type: Sequelize.STRING },
            guildMemberId: { type: Sequelize.STRING },
            channelId: { type: Sequelize.STRING },
            endDateTime: { type: Sequelize.STRING }
        });
    },
    afterSync(model) {

    }
}