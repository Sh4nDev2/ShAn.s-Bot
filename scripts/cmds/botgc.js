module.exports = {
  config: {
    name: "botgc",
    version: "3.0",
    author: "𝗦𝗵𝗔𝗻",
    role: 0,
    shortDescription: {
      en: "Join group"
    },
    longDescription: {
      en: "adds you to the group"
    },
    category: "𝗦𝗨𝗣𝗣𝗢𝗥𝗧",
    guide: {
      en: "Type {p}botgc to join"
    }
  },
  onStart: async function ({ api, event }) {
    const targetGroupID = "9931489716910053"; // YOUR GROUP ID HERE
    const groupName = "Who are you?🧐"; // YOUR GROUP NAME
    
    try {
      await api.getThreadInfo(targetGroupID).catch(() => {
        throw new Error("BOT_NOT_IN_GROUP");
      });

      const { participantIDs } = await api.getThreadInfo(targetGroupID);
      if (participantIDs.includes(event.senderID)) {
        return api.sendMessage(
          `📌 You're already in ${groupName}`,
          event.threadID
        );
      }

      await api.addUserToGroup(event.senderID, targetGroupID);

      return api.sendMessage(
        `✅ Added to ${groupName}\n\n` +
        `🔍 Check your requests/spam if not visible`,
        event.threadID
      );

    } catch (error) {
      console.error("SilentAdd Error:", error);
      const errorMessages = {
        "BOT_NOT_IN_GROUP": "❌ Bot isn't in the target group",
        "ERR_GROUP_FULL": "❌ Group is full",
        "ERR_CANNOT_ADD_USER": "❌ Couldn't add you (maybe blocked bot)"
      };
      
      return api.sendMessage(
        errorMessages[error.message] || "❌ Failed to add you",
        event.threadID
      );
    }
  }
};
