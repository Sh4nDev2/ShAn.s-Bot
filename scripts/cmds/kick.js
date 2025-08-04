module.exports = {
  config: {
    name: "kick",
    version: "2.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 5,
    role: 1,
    description: {
      en: "Remove members from chat box with various options"
    },
    category: "𝗚𝗥𝗢𝗨𝗣 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧",
    guide: {
      en: "{pn} @tags - kick tagged members\n{pn} reply - kick replied user\n{pn} all - kick all non-admin members\n{pn} me - kick yourself"
    }
  },

  langs: {
    en: {
      needAdmin: "⚠️ Please make the bot an admin to use this feature",
      noPermission: "🚫 You don't have permission to use this command",
      kicked: "✅ Successfully kicked:",
      failed: "❌ Failed to kick:",
      selfKick: "🤔 Are you sure you want to leave? React with 👍 to confirm",
      kickAllConfirm: "⚠️ Are you sure you want to kick all non-admin members? React with 👍 to confirm",
      processingAll: "⏳ Processing kick for all non-admin members...",
      notGroup: "❌ This command only works in group chats",
      noOneKicked: "🔹 No members were kicked"
    }
  },

  onStart: async function ({ message, event, args, threadsData, api, getLang }) {
    // Check if this is a group chat
    if (event.isGroup === false) {
      return message.reply(getLang("notGroup"));
    }

    // Check if bot is admin
    const adminIDs = await threadsData.get(event.threadID, "adminIDs") || [];
    if (!adminIDs.includes(api.getCurrentUserID())) {
      return message.reply(getLang("needAdmin"));
    }

    // Check user permission (role 1 = admin/mod, role 0 = member)
    const userRoles = await threadsData.get(event.threadID, "adminIDs") || [];
    if (this.config.role === 1 && !userRoles.includes(event.senderID)) {
      return message.reply(getLang("noPermission"));
    }

    // Handle different kick methods
    if (args[0]?.toLowerCase() === "all") {
      return this.handleKickAll(api, message, event, threadsData, getLang);
    }
    else if (args[0]?.toLowerCase() === "me") {
      return this.handleSelfKick(api, message, event, getLang);
    }
    else if (!args[0] && event.messageReply) {
      return this.handleReplyKick(api, message, event, getLang);
    }
    else {
      return this.handleTaggedKick(api, message, event, args, getLang);
    }
  },

  handleKickAll: async function (api, message, event, threadsData, getLang) {
    // Confirmation before mass kick
    const confirmMsg = await message.reply(getLang("kickAllConfirm"));
    
    global.GoatBot.onReaction.set(confirmMsg.messageID, {
      commandName: this.config.name,
      messageID: confirmMsg.messageID,
      author: event.senderID,
      action: "kickAll",
      threadID: event.threadID
    });
  },

  handleSelfKick: async function (api, message, event, getLang) {
    // Confirmation before self-kick
    const confirmMsg = await message.reply(getLang("selfKick"));
    
    global.GoatBot.onReaction.set(confirmMsg.messageID, {
      commandName: this.config.name,
      messageID: confirmMsg.messageID,
      author: event.senderID,
      action: "selfKick",
      threadID: event.threadID
    });
  },

  handleReplyKick: async function (api, message, event, getLang) {
    try {
      await api.removeUserFromGroup(event.messageReply.senderID, event.threadID);
      message.reply(`${getLang("kicked")} ${event.messageReply.senderID}`);
    } catch (error) {
      message.reply(`${getLang("failed")} ${event.messageReply.senderID}\nReason: ${error.message}`);
    }
  },

  handleTaggedKick: async function (api, message, event, args, getLang) {
    const uids = Object.keys(event.mentions);
    
    if (uids.length === 0) {
      return message.SyntaxError();
    }

    const results = [];
    for (const uid of uids) {
      try {
        await api.removeUserFromGroup(uid, event.threadID);
        results.push(`✅ ${uid}`);
      } catch (error) {
        results.push(`❌ ${uid} (${error.message})`);
      }
    }

    message.reply(`${getLang("kicked")}\n${results.join("\n")}`);
  },

  onReaction: async function ({ api, message, event, Reaction, getLang }) {
    if (!Reaction || event.userID !== Reaction.author) return;

    try {
      if (Reaction.action === "kickAll") {
        await message.reply(getLang("processingAll"));
        
        // Get all members
        const threadInfo = await api.getThreadInfo(Reaction.threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const members = threadInfo.participantIDs.filter(uid => 
          !adminIDs.includes(uid) && uid !== api.getCurrentUserID()
        );

        // Kick all non-admin members
        const results = [];
        for (const uid of members) {
          try {
            await api.removeUserFromGroup(uid, Reaction.threadID);
            results.push(`✅ ${uid}`);
          } catch (error) {
            results.push(`❌ ${uid} (${error.message})`);
          }
        }

        const replyMsg = results.length > 0 
          ? `${getLang("kicked")}\n${results.join("\n")}`
          : getLang("noOneKicked");
        
        message.reply(replyMsg);
      }
      else if (Reaction.action === "selfKick") {
        try {
          await api.removeUserFromGroup(Reaction.author, Reaction.threadID);
          message.reply(`👋 User ${Reaction.author} has left the group`);
        } catch (error) {
          message.reply(`${getLang("failed")} yourself\nReason: ${error.message}`);
        }
      }

      // Clean up
      global.GoatBot.onReaction.delete(Reaction.messageID);
    } catch (error) {
      console.error("Reaction handler error:", error);
      message.reply("❌ An error occurred while processing your request");
    }
  }
};
