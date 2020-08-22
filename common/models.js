const Sequelize = require("sequelize");
const fs = require("fs");

module.exports = {
    _sequelize: null,
    _initialized: false,
    init(modelsPath) {
        if (!this._initialized) {
            this._sequelize = new Sequelize("database", "user", "password", {
                host: "localhost",
                dialect: "sqlite",
                logging: false,
                storage: "database.sqlite"
            });
            fs.readdirSync(modelsPath).forEach(file => {
                console.log(`Chargement model "${file}"`);
                const model = require(modelsPath + "/" + file);
                model.init(this._sequelize).sync(model.syncOptions).then(seqModel => {
                    model.afterSync(seqModel);
                });
            });
            this._initialized = true;
        }
    },
    getModel(modelName) {
        return this._sequelize.models[modelName];
    }
}