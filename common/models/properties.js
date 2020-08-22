const Sequelize = require("sequelize");

module.exports = {
    syncOptions: {},
    init(sequelize) {
        return sequelize.define("properties", {
            key: { type: Sequelize.STRING, unique: true },
            value: { type: Sequelize.STRING }
        });
    },
    afterSync(model) {
        model.findOne({ where: { key: "MUTE_ROLE_NAME" } }).then(result => {
            if (result == null) {
                model.create({ key: "MUTE_ROLE_NAME", value: "🤫" })
            }
        });
        model.findOne({ where: { key: "MUTE_ROLE_ID" } }).then(result => {
            if (result == null) {
                model.create({ key: "MUTE_ROLE_ID", value: "" })
            }
        });
    }
}