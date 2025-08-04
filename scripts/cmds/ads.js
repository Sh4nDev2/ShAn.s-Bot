const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ads",
    version: "1.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 1,
    role: 0,
    shortDescription: "Create a fake advertisement with a user's avatar",
    longDescription: "Generates a fake advertisement image featuring the mentioned user's avatar",
    category: "𝗙𝗨𝗡",
    guide: "{pn} [mention|reply|leave_blank]",
  },

  langs: {
    en: {
      success: "Latest Brand In The Market 🥳"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    try {
      let uid;
      
      // Determine target user
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }

      // Generate ad image
      const avatarUrl = await usersData.getAvatarUrl(uid);
      const adImage = await new DIG.Ad().getImage(avatarUrl);

      // Save temporary file
      const tempFilePath = path.join(__dirname, "tmp", `ad_${event.messageID}.png`);
      await fs.outputFile(tempFilePath, adImage);

      // Send response
      await message.reply({
        body: getLang("success"),
        attachment: fs.createReadStream(tempFilePath)
      });

      // Clean up
      fs.unlink(tempFilePath).catch(console.error);

    } catch (error) {
      console.error("Error in ads command:", error);
      message.reply("Failed to generate the advertisement. Please try again later.");
    }
  }
};
