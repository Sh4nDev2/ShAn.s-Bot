module.exports = {
  config: {
    name: "all",
    version: "1.3",
    author: "NTKhang & Modified by [𝗦𝗵𝗔𝗻]",
    countDown: 5,
    role: 1,
    description: {
      vi: "Tag tất cả thành viên trong nhóm chat của bạn",
      en: "Tag all members in your group chat"
    },
    category: "𝗕𝗢𝗫 𝗖𝗛𝗔𝗧",
    guide: {
      vi: "   {p}{n} [nội dung | để trống]",
      en: "   {p}{n} [content | empty]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const { participantIDs } = event;
    const lengthAllUser = participantIDs.length;
    const mentions = [];
    let body = args.join(" ") || "@all";
    
    // Convert body to array of grapheme clusters (properly handles emojis)
    const bodyArray = Array.from(body);
    let bodyLength = bodyArray.length;
    let i = 0;
    
    for (const uid of participantIDs) {
      let fromIndex = 0;
      if (bodyLength < lengthAllUser) {
        // Add the last character/emoji if needed
        body += bodyArray[bodyLength - 1] || "";
        bodyArray.push(bodyArray[bodyLength - 1] || "");
        bodyLength++;
      }
      
      if (body.slice(0, i).lastIndexOf(bodyArray[i]) != -1) {
        fromIndex = i;
      }
      
      mentions.push({
        tag: bodyArray[i] || "@", // Fallback to @ if undefined
        id: uid,
        fromIndex
      });
      i++;
    }
    
    // Ensure the body contains all tags
    if (bodyLength < lengthAllUser) {
      body = bodyArray.join("") + bodyArray.slice(-1).join("").repeat(lengthAllUser - bodyLength);
    }
    
    message.reply({ 
      body: body,
      mentions 
    });
  }
};
