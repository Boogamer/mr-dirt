module.exports = {
    getMessageUserId(value) {
        // <@!718886146461138974>
        if (value == null | value.indexOf("<@!") === -1 | value.indexOf(">") === -1) {
            return null;
        }
        return value.substring(3, value.length - 1);
    }
};