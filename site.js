const fwk = require(__dirname + "/site/fwk.js");

module.exports = {
    init(client) {
        return new Promise((resolve, reject) => {
            fwk.init({
                client: client,
                i18nPath: __dirname + "/common/i18n",
                modelsPath: __dirname + "/common/models",
                staticPath: __dirname + "/site/static",
                routesPath: __dirname + "/site/routes",
                viewsPath: __dirname + "/site/templates",
                discord: {
                    authorizePage: "https://discord.com/api/oauth2/authorize?client_id=739490722151137330&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify%20email%20guilds"
                },
            }).then(app => {
                const port = process.env.SITE_PORT;
                app.listen(port, () => {
                    console.log(`Site listening on port "${port}"`);
                    resolve();
                });
            });
        });
    }
};