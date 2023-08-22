const { SlashCommandBuilder, Guild } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nsfwa')
    .setDescription('Get a NSFW image. Must be in NSFW CHANNEL')
    .addStringOption((option) =>
      option
        .setName('choice')
        .setDescription('Choose from the available options.')
        .setRequired(true)
        .addChoices(
          { name: 'anal', value: 'anal' },
          { name: 'pussy', value: 'pussy' },
          { name: 'boobs', value: 'boobs' },
          { name: 'hass', value: 'hass' },
          { name: 'hboobs', value: 'hboobs' },
          { name: 'hentai', value: 'hentai' },
          { name: 'hkitsune', value: 'hkitsune' },
          { name: 'hmidriff', value: 'hmidriff' },
          { name: 'hneko', value: 'hneko' },
          { name: 'holo', value: 'holo' },
          { name: 'kemonomimi', value: 'kemonomimi' },
          { name: 'pgif', value: 'pgif' },
          { name: 'yaoi', value: 'yaoi' },
          { name: 'neko', value: 'neko' },
          )),
      
          async execute(interaction) {
            console.log(`${interaction.user.username} used the NSFW command in ${interaction.guild.name}`);

            // Check if the channel is NSFW
            if (!interaction.channel.nsfw) {
              console.log(`${interaction.user.username} used a command that can only be used in NSFW channels in ${interaction.guild.name}.`);
              return interaction.reply('This command can only be used in NSFW channels.');
    }

    // Get the selected choice from the interaction options
    const choice = interaction.options.getString('choice');

    try {
      // Send a GET request to the nekobot.xyz API using the selected choice
      const response = await axios.get(`https://nekobot.xyz/api/image?type=${choice}`);

      // Extract the image URL from the API response
      const imageUrl = response.data.message;

      // Create the embed with the image and footer
      const embed = {
        color: 0xFF0000, // Set color to red
        image: {
          url: imageUrl,
        },
        footer: {
          text: 'Krowzie NSFW!', // Set your bot's promotion text
        },
      };

      // Create the components array with the URL button
      const components = [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5, // Style 5 is for link buttons
              label: 'Press if image does not load',
              url: imageUrl, // Set the URL for the button to the image URL
            },
          ],
        },
      ];

      // Send the interaction reply with the embed and components
      await interaction.reply({
        embeds: [embed],
        components: components,
        
      });
    } catch (error) {
      console.error('Error retrieving NSFW image:', error);
      interaction.reply('An error occurred while retrieving the NSFW image.');
    }
  },
};
