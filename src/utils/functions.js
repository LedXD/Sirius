const { EmbedBuilder, InteractionResponse } = require('discord.js');

const good = new EmbedBuilder()
.setColor('Green')
.setDescription('Success');


const bad = new EmbedBuilder()
.setColor('Red')
.setDescription('Error');


function success(cosmetic, message) {
  good.setDescription(`**${cosmetic.data.name}** [**${cosmetic.data.id}**] has been equipped.`);
  Interaction.reply(good);
}

function success2(cosmetic, message) {
  good.setDescription(`**${cosmetic}** has been equipped.`);
  Interaction.reply(good);
}

function success3(content, message) {
  good.setDescription(content);
  Interaction.reply(good);
}

function error(cosmetic, message) {
  bad.setDescription(`No ${cosmetic} was found using current paramaters.`);
  Interaction.reply(bad);
}

function error2(content, message) {
  bad.setDescription(content);
  Interaction.reply(bad);
}

module.exports = {
  success: success,
  success2: success2,
  success3: success3,
  error: error,
  error2: error2
}
