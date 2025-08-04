const axios = require('axios');

module.exports = {
  config: {
    name: "activemember",
    aliases: ["am"],
    version: "1.1",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐆𝐞𝐭 𝐓𝐡𝐞 𝐓𝐨𝐩 60 𝐔𝐬𝐞𝐫𝐬 𝐁𝐲 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐂𝐨𝐮𝐧𝐭 𝐢𝐧 𝐓𝐡𝐞 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐂𝐡𝐚𝐭",
      bn: "বর্তমান চ্যাটে শীর্ষ 60 সক্রিয় ব্যবহারকারী দেখুন"
    },
    longDescription: {
      en: "𝐆𝐞𝐭 𝐓𝐡𝐞 𝐓𝐨𝐩 60 𝐔𝐬𝐞𝐫𝐬 𝐁𝐲 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐂𝐨𝐮𝐧𝐭 𝐢𝐧 𝐓𝐡𝐞 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐂𝐡𝐚𝐭",
      bn: "বর্তমান চ্যাটে বার্তা সংখ্যা অনুযায়ী শীর্ষ 60 ব্যবহারকারী দেখায়"
    },
    category: "group management",
    guide: {
      en: "{p}{n}",
      bn: "{p}{n}"
    }
  },

  langs: {
    en: {
      processing: "⏳ 𝐂𝐚𝐥𝐜𝐮𝐥𝐚𝐭𝐢𝐧𝐠 𝐀𝐜𝐭𝐢𝐯𝐞 𝐌𝐞𝐦𝐛𝐞𝐫𝐬...",
      resultHeader: "𝐓𝐨𝐩 𝐀𝐜𝐭𝐢𝐯𝐞 𝐌𝐞𝐦𝐛𝐞𝐫𝐚 💁‍♀️:",
      userFormat: "╔═══════════╗\n『%1』 \n𝐒𝐞𝐧𝐝 %2 𝐌𝐞𝐬𝐬𝐚𝐠𝐞𝐬 \n╚═══════════╝",
      error: "❌ 𝐀𝐧 𝐄𝐫𝐫𝐨𝐫 𝐎𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐖𝐡𝐢𝐥𝐞 𝐂𝐚𝐥𝐜𝐮𝐥𝐚𝐭𝐢𝐧𝐠 𝐀𝐜𝐭𝐢𝐯𝐞 𝐌𝐞𝐦𝐛𝐞𝐫𝐬."
    },
    bn: {
      processing: "⏳ সক্রিয় সদস্যদের গণনা করা হচ্ছে...",
      resultHeader: "টপ অ্যাক্টিভ মেম্বার্স 💁‍♀️:",
      userFormat: "╔═══════════╗\n『%1』 \n%2 টি বার্তা পাঠিয়েছেন \n╚═══════════╝",
      error: "❌ সক্রিয় সদস্যদের গণনা করতে সমস্যা হয়েছে।"
    }
  },

  onStart: async function ({ api, event, message, getLang }) {
    const threadId = event.threadID; 
    const senderId = event.senderID;
    
    try {
      const loadingMessage = await message.reply(getLang("processing"));
      
      const participants = await api.getThreadInfo(threadId, { participantIDs: true });
      const messageCounts = {};

      participants.participantIDs.forEach(participantId => {
        messageCounts[participantId] = 0;
      });

      const messages = await api.getThreadHistory(threadId, 1000);

      messages.forEach(message => {
        const messageSender = message.senderID;
        if (messageCounts[messageSender] !== undefined) {
          messageCounts[messageSender]++;
        }
      });

      const topUsers = Object.entries(messageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 60);

      const userList = [];
      for (const [userId, messageCount] of topUsers) {
        const userInfo = await api.getUserInfo(userId);
        const userName = userInfo[userId].name;
        userList.push(getLang("userFormat", userName, messageCount));
      }

      // Send final result
      await message.reply({
        body: `${getLang("resultHeader")}\n\n${userList.join('\n')}`,
        mentions: [{ tag: senderId, id: senderId }]
      });

      await message.unsend(loadingMessage.messageID);

    } catch (error) {
      console.error(error);
      await message.reply(getLang("error"));
    }
  }
};
