const {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");
const settings = require("./config");

/**
 *
 * @param {Client} client
 * @param {settings} settings
 */
module.exports = async (client, settings) => {
  // code

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      switch (interaction.commandName) {
        case "setup":
          {
            let applyChannel = interaction.guild.channels.cache.get(
              settings.applyChannel
            );
            if (!applyChannel) return;

            let btnrow = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("ap_ping")
                .setLabel("เรียกหนู !!")
                .setEmoji("<:cg:1033436066394415205>"),
              new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("ap_apply")
                .setLabel("รายงานปัญหา")
                .setEmoji("<:new:1033410113370865724>"),
            ]);
            applyChannel.send({
              embeds: [
                new MessageEmbed()
                  .setColor("BLURPLE")
                  .setTitle(`- <:new:1033410113370865724> ระบบการรายงานปัญหา/บัคเซิฟเวอร์ ${interaction.guild.name}`)
                  .setDescription(
                    `▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱ \n\n > <:sp:1033436068780978176> **เเนะนะการใช้บอทเบื้องต้น** <:sp:1033436068780978176> \n > <:dot:1033418292162990182> \` ปุ่มสีฟ้า \` - ตรวจสอบว่าบอทอยู่มั้ย \n> <:dot:1033418292162990182> \` ปุ่มสีเขียว \` - รายงานปัญหา \n\n▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱
\n `) 
                  .setImage("https://cdn.discordapp.com/attachments/1227582261700853781/1228294620048396289/admin_2.gif?ex=662b8582&is=66191082&hm=103dfc6255a12631f73a65b5f545bc9bc6724542308b99469d422a9bbc9a1fda&"),
                  
              ],
              components: [btnrow],
            });

            interaction.reply({
              content: `> ตั้งค่าใน ${applyChannel}`,
            });
          }
          break;
        case "ping":
          {
            interaction.reply({
              content: `ปิง :: ${client.ws.ping}`,
              ephemeral: true,
            });
          }
          break;

        default:
          interaction.reply({
            content: `ไม่พบคำสั่ง ${interaction.commandName}`,
            ephemeral: true,
          });
          break;
      }
    }

    // for buttons
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "ap_ping":
          {
            interaction.reply({
              content: `หนูกำลังทำงานอยู่ คุณสามารถราายงานปัญหาได้`,
              ephemeral: true,
            });
          }
          break;

        case "ap_apply":
          {
            let application_modal = new Modal()
              .setTitle(`รายงานปัญหา 3G`)
              .setCustomId(`application_modal`);

            const user_name = new TextInputComponent()
              .setCustomId("ap_username")
              .setLabel(`คุณชื่ออะไร ?`.substring(0, 45))
              .setMinLength(2)
              .setMaxLength(50)
              .setRequired(true)
              .setPlaceholder(`ตอบชื่อของคุณ`)
              .setStyle("SHORT");

            const user_why = new TextInputComponent()
              .setCustomId("ap_userwhy")
              .setLabel(`ปัญหาที่คุณต้องการรายงาน`.substring(0, 45))
              .setMinLength(0)
              .setMaxLength(2000)
              .setRequired(true)
              .setPlaceholder(`อธิบายปัญหาของคุณ`)
              .setStyle("PARAGRAPH");

            let row_username = new MessageActionRow().addComponents(user_name);
            let row_userwhy = new MessageActionRow().addComponents(user_why);
            application_modal.addComponents(row_username, row_userwhy);

            await interaction.showModal(application_modal);
          }
          break;
        case "ap_accept":
          {
            let embed = new MessageEmbed(
              interaction.message.embeds[0]
            ).setColor("GREEN");

            interaction.message.edit({
              embeds: [embed],
              components: [],
            });

            let ap_user = interaction.guild.members.cache.get(
              embed.footer.text
            );

            ap_user.send(`แอดมิน ${interaction.user.tag} ได้รับเรื่องปัญหาของคุณแล้ว`).catch(e => {})

            await interaction.member.roles.add(settings.helperrole).catch(e => {})
            await interaction.member.roles.remove(settings.waitingrole).catch(e => {})
          }
          break;
        case "ap_reject":
          {
            let embed = new MessageEmbed(
              interaction.message.embeds[0]
            ).setColor("RED");

            interaction.message.edit({
              embeds: [embed],
              components: [],
            });

            let ap_user = interaction.guild.members.cache.get(
              embed.footer.text
            );

            ap_user.send(`แอดมิน ${interaction.user.tag} ไม่รับคำรายงานของคุณ , โปรดรายงานใหม่`).catch(e => {})
            await interaction.member.roles.remove(settings.waitingrole).catch(e => {})
          }
          break;
        default:
          break;
      }
    }

    // for modals
    if (interaction.isModalSubmit()) {
      let user_name = interaction.fields.getTextInputValue("ap_username");
      let user_why = interaction.fields.getTextInputValue("ap_userwhy");

      let finishChannel = interaction.guild.channels.cache.get(
        settings.finishChannel
      );
      if (!finishChannel) return;
      let btnrow = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("ap_accept")
          .setLabel("รับเรื่อง")
          .setEmoji("✅"),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("ap_reject")
          .setLabel("ปฏิเสธ")
          .setEmoji("❌"),
      ]);

      finishChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`ปัญหาจากคุณ ${interaction.user.tag}`)
            .setDescription(
              `${interaction.user} <t:${Math.floor(Date.now() / 1000)}:R>`
            )
            .addFields([
              {
                name: `คุณชื่ออะไร ?`,
                value: `> ${user_name}`,
              },
              {
                name: `ปัญหาที่พบ`,
                value: `> ${user_why}`,
              },
            ])
            .setFooter({
              text: `${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
        components: [btnrow],
      });

      interaction.reply({
        content: `การรายงานของคุณถูกส่งเพื่อตรวจสอบ \n > \` ระบบ \` \n\` » ขอบคุณสำหรับการรายงาน - แอดมินได้รับรายงานของคุณแล้วรอติดต่อกลับในไม่ช้า \` `,
        ephemeral: true,
      });

      await interaction.member.roles.add(settings.waitingrole).catch(e => {})
    }
  });
};
