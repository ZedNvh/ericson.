let isEnabled = true;

const axios = require("axios");

module.exports.config = {
   name: "autoreact",
   version: "9.0.5",
   role: 0,
   credits: "MILDPAIN",
   description: "Automatically reacts to messages containing specific keywords",
   commandCategory: "fun",
   usages: "autoreact [on/off]",
   cooldowns: 0,
 hasPrefix: true,
};

module.exports.run = async function ({ api, event, args }) {
  try {
      if (args[0] === "off") {
          isEnabled = false;
          return api.sendMessage("Auto react is now turned off", event.threadID, event.messageID);
      } else if (args[0] === "on") {
          isEnabled = true;
          return api.sendMessage("Auto react is now turned on", event.threadID, event.messageID);
      }
  } catch (error) {
      console.error(error);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
      if (!isEnabled) return;


      const response = await axios.get(`https://eurix-api.replit.app/react?q=${encodeURIComponent(event.body)}`);
      const reaction = response.data.react;
api.setMessageReaction(reaction, event.messageID, (err) => {}, true);
  } catch (error) {
      console.error(error);
  }
};
