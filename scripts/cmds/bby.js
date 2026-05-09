const axios = require("axios");
const { ShAnBaby, ShAnBteach, ShAnBmsg, ShAnBlist, ShAnBedit, ShAnBdelete } = require('shan-server')

const cError = (api, threadID, messageID) =>
  api.sendMessage("SH AN er api off 🦆💨", threadID, messageID);

module.exports.config = {
  name: "bby",
  aliases: ["baby","bbu", "shan"],
  version: "1.6.9",
  author: "♡︎ 𝗦𝗵𝗔𝗻 ♡︎",
  role: 0,
  description: {
    en: "Talk with the bot or teach it new responses"
  },
  category: "talk",
  countDown: 3,
  guide: {
    en: `{p}{n} <text> - Ask the bot something\n{p}ShAn teach <ask> - <answer> - Teach the bot a new response\n\nExamples:\n1. {p}{n} Hello\n2. {p}ShAn teach hi - hello\n3. {p}ShAn delete <text> - Delete all answers related to text\n4. {p}ShAn delete <text> - <index> - Delete specific answer at index\n5. {p}ShAn edit <Ask> - <New Ask> to update the ask query\n6. {p}ShAn edit <ask> - <index> - <new ans> update specific answer at index`,
  },
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const { threadID, messageID, senderID } = event;
  
  if (args.length === 0) {
    return api.sendMessage("Please provide text or teach the bot!", threadID, messageID);
  }

  const input = args.slice(1).join(" ").trim();

  if (args[0] === 'teach' || args[0] === '-t') {
    try {
      const [ask, answers] = input.split(" - ").map(text => text.trim());
      if (!ask || !answers) {
        return api.sendMessage("Invalid format. Use: {pn} teach <ask> - <answer1, answer2, ...>", threadID, messageID);
      }

      const answerArray = answers.split(",").map(ans => ans.trim()).filter(ans => ans !== "");

      const res = await ShAnBteach(ask, answerArray.join(","), senderID, 3, this.config.author);

      let msg = "";
      //if add rewards
    /*const reward = 5000;
    const userData = await usersData.get(senderID);
    const name = userData?.name || "User";*/

    switch (res.status) {
      case "Already Exists":
        msg = res.ShAn;
        break;

      case "Partial Success":
        //await usersData.set(senderID, { ...userData, money: (userData.money || 0) + reward });
        msg = res.ShAn; /*+
                      `\n🎉 Hey ${name} you win 5k coins! 💰`*/
        break;

      case "Success":
        //await usersData.set(senderID, { ...userData, money: (userData.money || 0) + reward });
        msg = res.ShAn /*+
                      `🎉 Hey ${name} you win 5k coins! 💰`*/
        break;

      default:
        msg = res.ShAn || "❌ Teaching failed.";
    }

    return api.sendMessage(msg, threadID, messageID);

  } catch (error) {
    return cError(api, threadID, messageID);
  }
} else if (args[0] === 'msg' || args[0] === '-m') {
    try {
      const res = await ShAnBmsg(input, senderID, 3, this.config.author);

      return api.sendMessage(`📜 Ask: ${res.ask}\n\n${res.ShAn}`, threadID, messageID);
    } catch {
      return cError(api, threadID, messageID);
    }
  } else if (args[0] === 'list' || args[0] === '-l') {
    try {
      const res = await ShAnBlist(3, this.config.author);

      return api.sendMessage(res.ShAn, threadID, messageID);
    } catch {
      return cError(api, threadID, messageID);
    }
  } else if (args[0] === 'edit' || args[0] === '-e') {
    try {
      const parts = input.split(" - ").map(part => part.trim());

      if (parts.length < 2) {
        return api.sendMessage("Invalid format. Use:\n1. {pn} edit <ask> - <newAsk>\n2. {pn} edit <ask> - <index> - <newAnswer>", threadID, messageID);
      }

      const [ask, newAskOrIndex, newAns] = parts;
      if (!isNaN(newAskOrIndex) && newAns) {
        const index = parseInt(newAskOrIndex, 10);

        const res = await ShAnBedit(ask, newAns, senderID, 3, this.config.author, index);

        return api.sendMessage(res.status === "Success"
          ? `✅ Successfully updated answer at index ${index} to: ${newAns}`
          : res.ShAn || "❌ Failed to update the answer!", threadID, messageID);
      } else {
        const res = await ShAnBedit(ask, newAskOrIndex, senderID, 2, this.config.author);

        return api.sendMessage(res.status === "Success"
          ? `✅ Successfully updated question to: ${newAskOrIndex}`
          : res.ShAn || "❌ Failed to update the question!", threadID, messageID);
      }
    } catch {
      return cError(api, threadID, messageID);
    }
  } else if (args[0] === 'remove' || args[0] === '-r' || args[0] === 'delete' || args[0] === '-d') {
  try {
    const parts = input.split(" - ").map(part => part.trim());

    if (!parts[0]) {
      return api.sendMessage("Invalid format. Use: {pn} delete <text> OR {pn} delete <text> - <index>", threadID, messageID);
    }

    const text = parts[0];
    const index = parts[1] && !isNaN(parts[1]) ? parseInt(parts[1], 10) : null;

    if (index !== null) {
      const res = await ShAnBdelete(text, senderID, 3, this.config.author, index);
      return api.sendMessage(res.status === "Success"
        ? `✅ Successfully deleted answer at index ${index} of: ${text}`
        : res.ShAn || "❌ Failed to delete the message!", threadID, messageID);
    } else {
      const res = await ShAnBdelete(text, senderID, 3, this.config.author);
      return api.sendMessage(res.status === "Success"
        ? `✅ Successfully deleted all answers related to: ${text}`
        : res.ShAn || "❌ Failed to delete the message!", threadID, messageID);
    }
  } catch {
    return cError(api, threadID, messageID);
  }
  } else {
    try {
      const res = await ShAnBaby((args.join(" ")), senderID, 2, this.config.author);
      const ans = res.ShAn;
      const react = res.react;

      return api.sendMessage(ans + react, threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
                commandName: module.exports.config.name,
                type: "reply",
                messageID: info.messageID,
                author: senderID,
                ans
            });
        }, messageID);

    } catch {
      return cError(api, threadID, messageID);
    }
  }
};

module.exports.onChat = async ({ api, event }) => {
  const { threadID, messageID, body, senderID } = event;

  const cMessages = ["🎀 Hello bby!", "🎀 Hi there!", "🎀 Hey! How can I help?😝"];

  const userInput = body.toLowerCase().trim();
  const keywords = ["bby", "hii", "baby", "bot", "বট", "robot"];

  if (keywords.some((keyword) => userInput.startsWith(keyword))) {
    const isQuestion = userInput.split(" ").length > 1;
    if (isQuestion) {
      const question = userInput.slice(userInput.indexOf(" ") + 1).trim();

      try {
        const res = await ShAnBaby(question, senderID, 2, this.config.author);
        const ans = res.ShAn;
        const react = res.react;

        return api.sendMessage(ans + react, threadID, (error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              author: senderID,
              ans
            });
          }
        }, messageID);
      } catch (error) {
        return cError(api, threadID, messageID);
      }
    } else {
      const rMsg = cMessages[Math.floor(Math.random() * cMessages.length)];
      
      return api.sendMessage(rMsg, threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            author: senderID
          });
        }
      }, messageID);
    }
  }
};


module.exports.onReply = async ({ api, event }) => {
  const { threadID, messageID, senderID, body } = event;

  try {
    if (senderID == api.getCurrentUserID()) return;

    if (event.type == "message_reply") {
      const res = await ShAnBaby(body, senderID, 2, this.config.author);
      const ans = res.ShAn;
      const react = res.react;

      return api.sendMessage(ans + react, threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: senderID,
            ans
          });
        }
      }, messageID);
    }
  } catch {
    return cError(api, threadID, messageID);
  }
};
