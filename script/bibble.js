const axios = require("axios");

module.exports.config = {
    name: "bibbleverse",
    version: "1.0.0",
    role: 0,
    credits: "churchill",
    description: "Get a random Bible verse.",
    hasPrefix: true,
    aliases: ["bibleverse", "randombibbleverse"],
    usage: "",
    cooldown: 5,
};

module.exports.run = async function({ api, event }) {
    api.setMessageReaction("⏳", event.messageID, (err) => {
    }, true);
  api.sendTypingIndicator(event.threadID, true);
    try {
        api.sendMessage("⏱️ | Fetching a random Bible verse, please wait...", event.threadID);

        const response = await axios.get("https://deku-rest-api.replit.app/bible");
        const verse = response.data.verse;
        const reference = response.data.reference;

        const message = `📖 ${verse}\n- ${reference}`;

        api.sendMessage(message, event.threadID);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while fetching the Bible verse.", event.threadID);
    }
};
