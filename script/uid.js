module.exports.config = {
    name: "uid",
    role: 0,
    credits: "Mirai Team",
    description: "Get the user's Facebook UID.",
    hasPrefix: true,
    usages: "{p}uid {p}uid @mention",
    cooldown: 5,
    aliases: ["id", "ui"]
};

module.exports.run = async function({ api, event }) {
    try {
        if (Object.keys(event.mentions).length === 0) {
            if (event.messageReply) {
                const senderID = event.messageReply.senderID;
                return api.sendMessage(senderID.toString(), event.threadID);
            } else {
                return api.shareContact(event.senderID.toString(), event.threadID, event.messageID);
            }
        } else {
            for (const mentionID in event.mentions) {
                api.shareContact(mentionID.toString(), event.threadID, event.messageID);
            }
        }
    } catch (error) {
        console.error("An error occurred while executing the uid command:", error);
        api.sendMessage("An error occurred while trying to process your request. Please try again later.", event.threadID);
    }
};
