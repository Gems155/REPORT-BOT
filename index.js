const { Client } = require("discord.js");
const settings = require("./config");

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
});

client.on("ready", async () => {
  console.log(`online ${client.user.tag}`);
    let statuses = [
    `3G REPORT`
   ]

 setInterval(function() {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(status, {
      type: "STREAMING",
      url: "https://www.twitch.tv/3G" ,
      
      //สามารถเปลี่ยนเป็น PLAYING,STREAMING,LISTENING,WATCHING
      //Crate by NomYen#8031 :]
      
    });
  }, 10000);
  let guild = client.guilds.cache.get(settings.guildID);
  if (guild) {
    await guild.commands.set([
      {
        name: "setup",
        description: `ตั้งค่า`,
        type: "CHAT_INPUT",
      },
      {
        name: "ping",
        description: `ปิง`,
        type: "CHAT_INPUT",
      },
    ]);
  }
  require("./application_manager")(client, settings);
});

client.login(settings.token);
