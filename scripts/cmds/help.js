const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    aliases:["use", "cmdl"],
    version: "1.18",
    author: "♡︎ 𝗦𝗵𝗔𝗻 ♡︎", 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐕𝐢𝐞𝐰 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐔𝐬𝐚𝐠𝐞",
      bn: "কমান্ডের ব্যবহার দেখুন"
    },
    longDescription: {
      en: "𝐕𝐢𝐞𝐰 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐔𝐬𝐚𝐠𝐞 𝐀𝐧𝐝 𝐋𝐢𝐬𝐭 𝐀𝐥𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐎𝐟 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐁𝐲 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲",
      bn: "কাজের ব্যবহার এবং সকল কমান্ডের তালিকা দেখুন ক্যাটাগরি অনুসারে"
    },
    category: "info",
    guide: {
      en: "{p}{n} 𝐜𝐦𝐝𝐍𝐚𝐦𝐞\n{p}{n} -c <𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲𝐍𝐚𝐦𝐞>",
      bn: "{p}{n} কমান্ডনাম\n{p}{n} -c <ক্যাটাগরিনাম>"
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╔══════════════╗\n🔹 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🔹\n╚══════════════╝\n`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "𝐔𝐧𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐳𝐞𝐝";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭────────────⭓\n│『 ${category.toUpperCase()} 』`;

          const names = categories[category].commands.sort();
          names.forEach((item) => {
            msg += `\n│𖤍 ${item}`;
          });

          msg += `\n╰────────⭓`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝐂𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲, 𝐓𝐡𝐞 𝐁𝐨𝐭 𝐇𝐚𝐬 ${totalCommands} 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐓𝐡𝐚𝐭 𝐂𝐚𝐧 𝐁𝐞 𝐔𝐬𝐞𝐝\n`;
      msg += `\n𝐓𝐲𝐩𝐞 ${prefix}help 𝐜𝐦𝐝𝐍𝐚𝐦𝐞 𝐓𝐨 𝐕𝐢𝐞𝐰 𝐓𝐡𝐞 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 𝐎𝐟 𝐓𝐡𝐚𝐭 𝐂𝐨𝐦𝐦𝐚𝐧𝐝\n`;
      msg += `\n🔮𝐁𝐨𝐭 𝐍𝐚𝐦𝐞🔮: ${global.GoatBot.config.nickNameBot}`;
      msg += `\n🎀 𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 𝐍𝐚𝐦𝐞 🎀: ♡︎ 𝗦𝗵𝗔𝗻 ♡︎`;
      msg += `\n~𝐅𝐁: m.me/Sh4n.Dev`;
      

      await message.reply({
        body: msg,
      });
    } else if (args[0] === "-c") {
      if (!args[1]) {
        await message.reply("𝐏𝐥𝐞𝐚𝐬𝐞 𝐒𝐩𝐞𝐜𝐢𝐟𝐲 𝐚 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 𝐍𝐚𝐦𝐞.");
        return;
      }

      const categoryName = args[1].toLowerCase();
      const filteredCommands = Array.from(commands.values()).filter(
        (cmd) => cmd.config.category?.toLowerCase() === categoryName
      );

      if (filteredCommands.length === 0) {
        await message.reply(`𝐍𝐨 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐅𝐨𝐮𝐧𝐝 𝐢𝐧 𝐓𝐡𝐞 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 "${categoryName}".`);
        return;
      }

      let msg = `╔══════════════╗\n༒︎ ${categoryName.toUpperCase()} 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ༒︎\n╚══════════════╝\n`;

      filteredCommands.forEach((cmd) => {
        msg += `\n☠︎︎ ${cmd.config.name} `;
      });

      await message.reply(msg);
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`𝐂𝐨𝐦𝐦𝐚𝐧𝐝 "${commandName}" 𝐍𝐨𝐭 𝐅𝐨𝐮𝐧𝐝.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "♡︎ 𝗦𝗵𝗔𝗻 ♡︎";
        
        const userLanguage = global.GoatBot?.config?.language || "en";
        const shortDescription = configCommand.shortDescription
        ? configCommand.shortDescription[userLanguage] ||
           "𝐍𝐨 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐢𝐭𝐨𝐧"
         : "𝐍𝐨 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐢𝐭𝐨𝐧";
        
        const longDescription = configCommand.longDescription
        ? configCommand.longDescription[userLanguage] ||
           "𝐍𝐨 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐢𝐭𝐨𝐧"
         : "𝐍𝐨 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐢𝐭𝐨𝐧";
        
        const guideBody = configCommand.guide[userLanguage] || "𝐍𝐨 𝐆𝐮𝐢𝐝𝐞 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── 𝐍𝐀𝐌𝐄 ────⭓\n` +
          `│ ${configCommand.name}\n` +
          `├── 𝐈𝐍𝐅𝐎\n` +
          `│ 𝐬𝐡𝐨𝐫𝐭𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${shortDescription}\n` +
          `│ 𝐥𝐨𝐧𝐠𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${longDescription}\n` +
          `│ 𝐎𝐭𝐡𝐞𝐫 𝐍𝐚𝐦𝐞: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}\n` +
          `│ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${configCommand.version || "1.0"}\n` +
          `│ 𝐑𝐨𝐥𝐞: ${roleText}\n` +
          `│ 𝐓𝐢𝐦𝐞 𝐏𝐞𝐫 𝐂𝐨𝐦𝐦𝐚𝐧𝐝: ${configCommand.countDown || 1}s\n` +
          `│ 𝐀𝐮𝐭𝐡𝐨𝐫: ${author}\n` +
          `├── 𝐔𝐒𝐀𝐆𝐄\n` +
          `│ ${usage}\n` +
          `├── 𝐍𝐎𝐓𝐄𝐒\n` +
          `│ 𝐓𝐡𝐞 𝐂𝐨𝐧𝐭𝐞𝐧𝐭 𝐈𝐧𝐬𝐢𝐝𝐞 ♡︎ 𝗦𝗵𝗔𝗻 ♡︎ 𝐂𝐚𝐧 𝐁𝐞 𝐂𝐡𝐚𝐧𝐠𝐞𝐝\n` +
          `│ ♕︎ 𝐎𝐖𝐍𝐄𝐑 ♕︎:☠︎︎ 𝗦𝗵𝗔𝗻 ☠︎︎\n` +
          `╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (𝐀𝐥𝐥 𝐔𝐬𝐞𝐫𝐬)";
    case 1:
      return "1 (𝐆𝐫𝐨𝐮𝐩 𝐀𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐬)";
    case 2:
      return "2 (𝐀𝐝𝐦𝐢𝐧 𝐁𝐨𝐭)";
    default:
      return "𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐑𝐨𝐥𝐞";
  }
    }
