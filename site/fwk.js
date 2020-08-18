const fs = require("fs");

module.exports = {
    _locale: "gb",
    _locales: [],
    init() {
        this._initLocales();
    },
    setLocale(locale) {
        this._locale = locale;
    },
    getLabel(key, params) {
        if (this._locales[this._locale][key] == null) {
            return key;
        }
        let value = this._locales[this._locale][key];
        if ((typeof params) == "string") {
            params.split("|").forEach((param, index) => {
                value.replace("{" + index + "}", param);
            });
        }
        return value;
    },
    _initLocales() {
        const localesPath = __dirname + "/static/locales";
        fs.readdirSync(localesPath).forEach(file => {
            console.log(`Chargement locale "${file}"`);
            const locale = require(localesPath + "/" + file);
            this._locales[file.split(".")[0]] = locale;
        });
    }
}