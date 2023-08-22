const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addfriend')
    .setDescription('Send a friend request to someone.')
    .addStringOption(option =>
      option.setName('user')
        .setDescription('The user you want to send a friend request to.')
        .setRequired(true)),

        setBotInstance(bot) {
          this.bot = bot; // Store the bot instance
        },
      

  async execute(interaction, bot) {
    const user = interaction.options.getString('user');

    try {
      await bot.addFriend(user);
      await interaction.reply(`Friend request has been sent to ${user}.`);
    } catch (error) {
      console.error(error); // Log the detailed error message
      if (error.code === 'FRIEND_REQUEST_ALREADY_SENT') {
        await interaction.reply(`Friend request has already been sent to ${user}.`);
      } else if (error.code === 'USER_NOT_FOUND') {
        await interaction.reply(`Could not find user ${user}. Make sure you've entered the correct username.`);
      } else {
        await interaction.reply(`An error occurred while trying to add ${user} as a friend.`);
      }
    }
  },
};
