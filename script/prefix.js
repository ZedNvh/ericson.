const fs = require("fs");

module.exports.config = {
    name: "prefix",
    version: "1.0.1",
    role: 0,
    credits: "cliff",
    hasPrefix: false,
    description: "Display the prefix of your bot",
    usages: "prefix",
    cooldown: 5,
    aliases: ["prefix", "Prefix", "PREFIX", "prefi"],
};

module.exports.run = function ({ api, event, prefix, admin }) {
    var { threadID, messageID } = event;
    if (event.body.indexOf("prefix")==0 || (event.body.indexOf("Prefix")==0 || (event.body.indexOf("Ano prefix")==0 || (event.body.indexOf("ano prefix")==0)))) {
      const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Manila").format("HH:mm:ss || D/MM/YYYY");
      var msg = {
          body: `${prefix}`
        }
        api.shareContact(msg, api.getCurrentUserID(), threadID, messageID);
      }
      api.sendMessage(msg, threadID, messageID);
    }
  }
  module.exports.run = function({ api, event, prefix}) {

  }
