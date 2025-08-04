module.exports = {
  config: {
    name: "out",
    version: "1.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 5,
    role: 2, // 2 = admin, 1 = bot admin, 0 = regular user
    shortDescription: {
      en: "Make the bot leave a group chat"
    },
    longDescription: {
      en: "This command allows the bot owner to remove the bot from a group chat"
    },
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: {
      en: "To use: just type 'out' to leave current group, or 'out [threadID]' to leave specific group"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      if (args[0]) {
        // If a threadID is provided as argument
        const threadID = args[0];
        await api.sendMessage(`Leaving group with ID: ${threadID} as requested by owner.`, threadID);
        await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
        return message.reply(`Successfully left the group with ID: ${threadID}`);
      } else {
        // If no argument, leave current group
        await api.sendMessage("Goodbye everyone! 👋", event.threadID);
        await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
      }
    } catch (error) {
      console.error(error);
      message.reply("Failed to leave the group. Please check the threadID or my permissions.");
    }
  }
};
