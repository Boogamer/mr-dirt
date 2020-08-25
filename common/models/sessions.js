const Sequelize = require("sequelize");

module.exports = {
    syncOptions: {},
    init(sequelize) {
        return sequelize.define("sessions", {
            sid: {
                type: Sequelize.STRING(36),
                primaryKey: true
            },
            expires: Sequelize.DATE,
            data: Sequelize.TEXT
        });
    },
    afterSync(model) {

    }
}