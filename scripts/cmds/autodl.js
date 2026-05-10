const { ShAnAlldl } = require("shan-server");
const axios = require("axios");

module.exports = {
  config: {
    name: "autodl",
    version: "1.0",
    role: 0,
    usePrefix: false,
    author: "♡︎ 𝗦𝗵𝗔𝗻 ♡︎",
    shortDescription: {
      en: "Auto download videos"
    },
    category: "media"
  },

  onStart: async function({ args, message, event, threadsData }) {
    const inputStatus = args[0];
    
    if (!inputStatus) {
      const data = (await threadsData.get(event.threadID, "data")) || {};
      const current = data.autodl === "on" ? "ON ✅" : "OFF ❌";
      return message.send(`• Auto-download is currently: ${current}\n\nUsage: autodl on/off`);
    }
    
    if (role < 1) {
      return message.reply("𝐎𝐩𝐩𝐬𝐬 𝐛𝐚𝐏𝐲 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐧𝐨 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧")   
    }
      
    if (!["on", "off"].includes(inputStatus)) {
      return message.reply("❌ Invalid command\n✓ Use: autodl on/off");
    }
    const tData = (await threadsData.get(event.threadID, "data")) || {};
    const currentStatus = tData.autodl;
    
    if (currentStatus === inputStatus) {
      if (inputStatus === "on") {
        return message.send("⚠️ Auto-download is already ON for this thread");
      } else {
        return message.send("⚠️ Auto-download is already OFF for this thread");
      }
    }
    tData.autodl = inputStatus;
    await threadsData.set(event.threadID, tData, "data");
    
    if (inputStatus === "on") {
      return message.send("✅ Auto-download has been TURNED ON for this thread");
    } else {
      return message.send("❌ Auto-download has been TURNED OFF for this thread");
    }
  },

  onChat: async function({ event, message, threadsData }) {
    const settings = (await threadsData.get(event.threadID, "data")) || {};
    const isAutoDLEnabled = settings.autodl !== "off";
    
    if (!isAutoDLEnabled) return;
    
    const content = event.body || "";
    
    const urlPattern = /(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|instagram\.com|instagr\.am|pin\.it|pinterest\.com|youtu\.be|youtube\.com|twitter\.com|x\.com|facebook\.com|fb\.watch|fb\.me|capcut\.com|likee\.com|likee\.video|l\.likee\.video|threads\.com|threads\.net)\/[^\s]+/gi;
    
    const urls = content.match(urlPattern);
    
    if (!urls) return;
    
    for (const url of urls.slice(0, 3)) {
      try {
        const res = await ShAnAlldl(url, this.config.author);

        if (res.status !=="success") {
          throw new Error("api failed"); 
        }
        
        const videoStream = await axios.get(res.ShAn, { 
          responseType: "stream",
          timeout: 30000
        });
        await message.reaction("✔️", event.messageID);
        
        await message.reply({
          body: res.msg,
          attachment: videoStream.data
        });
        
      } catch (error) {
        await message.reaction("❌️", event.messageID);
        console.error("Auto-download error:", error);
      }
    }
  }
};
