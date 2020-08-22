const fs = require("fs");

module.exports = {
    _initialized: false,
    _files: {},
    _defaultLocale: "gb",
    init(i18nPath) {
        if (!this._initialized) {
            fs.readdirSync(i18nPath).forEach(file => {
                console.log(`Chargement locale "${file}"`);
                const locale = require(i18nPath + "/" + file);
                this._files[file.split(".")[0]] = locale;
            });
        }
        this._initialized = true;
    },
    getDefaultLocale() {
        return this._defaultLocale;
    },
    getLabel(locale, key, params) {
        if (this._files[locale][key] == null) {
            return key;
        }
        let value = this._files[locale][key];
        params.split("|").forEach((param, index) => {
            value.replace("{" + index + "}", param);
        });
        return value;
    }
}