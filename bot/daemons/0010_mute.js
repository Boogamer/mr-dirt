const moment = require('moment');

module.exports = {
    tick(client) {
        /*
        Fwk.getModel("mutes").findAll().then(mutes => {
            mutes.forEach(mute => {
                if (moment().isAfter(moment(mute.endDateTime))) {
                    client.guilds.cache.map(guild => {
                        if (guild.id == mute.guildId) {
                            guild.channels.cache.map(channel => {
                                if (channel.id == mute.channelId) {
                                    channel.members.each(user => {
                                        if(user.name == "Mr.Dirt") {
                                            user.send("Pouet");
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
        });
        */
    }
}