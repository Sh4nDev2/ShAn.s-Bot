const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "affect",
    version: "1.2",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 5,
    role: 0,
    shortDescription: "Create a 'Affect' meme with user's avatar",
    longDescription: "Generates a 'Affect' meme image using the mentioned user's profile picture",
    category: "𝗙𝗨𝗡",
    guide: "{pn} [@user]"
  },

  onStart: async function ({ event, message, usersData }) {
    try {
      // Get mentioned user or show error
      const mentionedUser = Object.keys(event.mentions);
      if (!mentionedUser.length) {
        return message.reply("Please mention a user to create the meme.");
      }

      const targetUserId = mentionedUser[0];
      const avatarURL = await usersData.getAvatarUrl(targetUserId);
      
      // Generate the affect image
      const affectedImage = await new DIG.Affect().getImage(avatarURL);
      
      // Create temporary file path
      const tempFilePath = path.join(__dirname, "tmp", `affect_${targetUserId}_${Date.now()}.png`);
      
      // Save image
      await fs.outputFile(tempFilePath, Buffer.from(affectedImage));
      
      // Send the image
      await message.reply({
        attachment: fs.createReadStream(tempFilePath)
      });
      
      // Clean up
      fs.unlink(tempFilePath).catch(err => console.error("Failed to delete temp file:", err));

    } catch (error) {
      console.error("Error in affect command:", error);
      message.reply("An error occurred while generating the image. Please try again later.");
    }
  }
};
