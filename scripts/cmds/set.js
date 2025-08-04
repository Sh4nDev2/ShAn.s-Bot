module.exports = {
  config: {
    name: "set",
    version: "1.0",
    author: "𝗦𝗵𝗔𝗻",
    role: 0,
    shortDescription: {
      en: "Set coins and experience points"
    },
    longDescription: {
      en: "Set coins and experience points"
    },
    category: "𝗕𝗔𝗡𝗞",
    guide: {
      en: "{pn} set [money|exp] [amount] [@mention (optional) or reply a message]"
    }
  },

  onStart: async function ({ args, event, api, usersData }) {
    const hasan = global.GoatBot.config.owner;
    if (!hasan.includes(event.senderID)) {
      return api.sendMessage("~murubbi murubbi !? 🦆💨", event.threadID);
    }

    const toxiciter = args[0]?.toLowerCase();
    const amount = parseInt(args[1]); // পরিমাণ
    const { senderID, threadID, mentions, messageReply } = event;
    const mentionKeys = Object.keys(mentions);

    // Reply মেসেজ চেক করে UID সেট করা
    let targetUser;
    if (event.type === "message_reply") {
      targetUser = messageReply.senderID;
    } else {
      targetUser = mentionKeys[0] || senderID;
    }

    if (!toxiciter || isNaN(amount) || amount <= 0) {
      return api.sendMessage("Invalid command! Usage:\nset [money|exp] [amount] [@mention (optional) or reply a message]", threadID);
    }

    const userData = await usersData.get(targetUser);

    if (!userData) {
      return api.sendMessage("User not found.", threadID);
    }

    const name = await usersData.getName(targetUser);

    if (toxiciter === 'exp') {
      await usersData.set(targetUser, {
        money: userData.money,
        exp: amount,
        data: userData.data
      });

      return api.sendMessage(`Set experience points to ${amount} for ${name}.`, threadID);
    } else if (toxiciter === 'money') {
      await usersData.set(targetUser, {
        money: amount,
        exp: userData.exp,
        data: userData.data
      });

      return api.sendMessage(`Set coins to ${amount} for ${name}.`, threadID);
    } else {
      return api.sendMessage("Invalid query. Use 'exp' to set experience points or 'money' to set coins.", threadID);
    }
  }
};
