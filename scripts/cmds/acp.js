const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 8,
    role: 2,
    shortDescription: {
      en: "𝐀𝐜𝐜𝐞𝐩𝐭 𝐔𝐬𝐞𝐫𝐬",
      bn: "ব্যবহারকারীদের গ্রহণ করুন"
    },
    longDescription: {
      en: "𝐀𝐜𝐜𝐞𝐩𝐭 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐔𝐬𝐞𝐫𝐬",
      bn: "বন্ধুত্বের অনুরোধ গ্রহণ করুন"
    },
    category: "owner",
    guide: {
      en: "{p}{n}",
      bn: "{p}{n}"
    }
  },
  langs: {
      en: {
        missingInput: "⚠️ | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐑𝐞𝐩𝐥𝐲 𝐖𝐢𝐭𝐡 [𝐀𝐝𝐝/𝐃𝐞𝐥] [𝐍𝐮𝐦𝐛𝐞𝐫/𝐀𝐥𝐥] 𝐓𝐨 𝐂𝐨𝐧𝐟𝐢𝐫𝐦/𝐃𝐞𝐥𝐞𝐭𝐞 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐬𝐭",
        successAdd: "✅ | 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐀𝐜𝐜𝐞𝐩𝐭𝐞𝐝 %1 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐬𝐭:",
        successDel: "✅ | 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐃𝐞𝐥𝐞𝐭𝐞𝐝 %1 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬:",
        failed: "❌ | 𝐅𝐚𝐢𝐥𝐞𝐝 𝐓𝐨 𝐏𝐫𝐨𝐜𝐞𝐬𝐬 %1 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬:",
        noRequests: "ℹ️ | 𝐍𝐨 𝐏𝐞𝐧𝐝𝐢𝐧𝐠 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬 𝐅𝐨𝐮𝐦𝐝.",
        listHeader: "📝 | 𝐇𝐞𝐫𝐞 𝐈𝐬 𝐏𝐞𝐧𝐝𝐢𝐧𝐠 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬:",
        invalidResponse: "❌ |𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐓𝐫𝐲 𝐀𝐠𝐚𝐢𝐧."
      },
      bn: {
        missingInput: "⚠️ | দয়া করে [𝐀𝐝𝐝/𝐃𝐞𝐥] [সংখ্যা/𝐀𝐥𝐥] দিয়ে উত্তর দিন",
        processing: "🔄 | বন্ধুত্বের অনুরোধ প্রক্রিয়া করা হচ্ছে...",
        successAdd: "✅ | সফলভাবে %1টি বন্ধুত্বের অনুরোধ গ্রহণ করা হয়েছে:",
        successDel: "✅ | সফলভাবে %1টি বন্ধুত্বের অনুরোধ মুছে ফেলা হয়েছে:",
        failed: "❌ | %1টি অনুরোধ প্রক্রিয়া করতে ব্যর্থ হয়েছে:",
        noRequests: "ℹ️ | কোনো বাকি বন্ধুত্বের অনুরোধ পাওয়া যায়নি।",
        listHeader: "📝 | বাকি বন্ধুত্বের অনুরোধ:",
        invalidResponse: "❌ | অবৈধ উত্তর। দয়া করে আবার চেষ্টা করুন।"
      }
    },

  onReply: async function ({ message, Reply, event, api, commandName, getLang }) {
    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return;
    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    clearTimeout(Reply.unsendTimeout);

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        refresh_num: 0
      }
    };

    const success = [];
    const failed = [];

    if (args[0] === "add") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
    }
    else if (args[0] === "del") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
      form.doc_id = "4108254489275063";
    }
    else {
      return api.sendMessage(getLang('missingInput'), event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);

    if (args[1] === "all") {
      targetIDs = [];
      const lengthList = listRequest.length;
      for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
      const u = listRequest[parseInt(stt) - 1];
      if (!u) {
        failed.push(`${stt}`);
        continue;
      }
      form.variables.input.friend_requester_id = u.node.id;
      form.variables = JSON.stringify(form.variables);
      newTargetIDs.push(u);
      promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
      form.variables = JSON.parse(form.variables);
    }

    const lengthTarget = newTargetIDs.length;
    for (let i = 0; i < lengthTarget; i++) {
      try {
        const friendRequest = await promiseFriends[i];
        if (JSON.parse(friendRequest).errors) {
          failed.push(newTargetIDs[i].node.name);
        }
        else {
          success.push(newTargetIDs[i].node.name);
        }
      }
      catch (e) {
        failed.push(newTargetIDs[i].node.name);
      }
    }

    if (success.length > 0) {
      const successMessage = args[0] === 'add' 
        ? getLang('successAdd', success.length) + "\n" + success.join("\n")
        : getLang('successDel', success.length) + "\n" + success.join("\n");
      
      const failedMessage = failed.length > 0 
        ? "\n\n" + getLang('failed', failed.length) + "\n" + failed.join("\n")
        : "";
      
      api.sendMessage(successMessage + failedMessage, event.threadID, event.messageID);
    } else {
      api.unsendMessage(messageID);
      return api.sendMessage(getLang('invalidResponse'), event.threadID);
    }

    api.unsendMessage(messageID);
  },

  onStart: async function ({ event, api, commandName, getLang }) {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };
    
    try {
      const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
      
      if (!listRequest || listRequest.length === 0) {
        return api.sendMessage(getLang('noRequests'), event.threadID);
      }

      let msg = getLang('listHeader') + "\n\n";
      let i = 0;
      for (const user of listRequest) {
        i++;
        msg += `${i}. ${user.node.name}\n`;
        msg += `   ID: ${user.node.id}\n`;
        msg += `   TIME: ${moment(user.time * 1000).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\n\n`;
      }

      msg += "\n" + getLang('missingInput');
      
      const sentMessage = await api.sendMessage(msg, event.threadID);

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName,
        messageID: sentMessage.messageID,
        listRequest,
        author: event.senderID,
        unsendTimeout: setTimeout(() => {
          api.unsendMessage(sentMessage.messageID);
        }, this.config.countDown * 10000)
      });

    } catch (error) {
      console.error(error);
      api.sendMessage(getLang('invalidResponse'), event.threadID);
    }
  }
};
