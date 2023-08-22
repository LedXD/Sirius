const Discord = require('discord.js');
const fetch = require('node-fetch');
const config = require('./config');
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9')
require('dotenv').config();

const { Collection, GatewayIntentBits } = require('discord.js');
const { Client, Enums } = require('fnbr');
const { readFile, writeFile } = require('fs').promises;

async function getCosmetic(name, backend) {
  const url = `https://fortnite-api.com/v2/cosmetics/br/search` +
    `?name=${name}` +
    `&backendType=${backend}` +
    `&matchMethod=contains`;

  return (await fetch(url)).json();
}

(async () => {
  const Options = {
    status: config.fortnite.status,
    platform: config.fortnite.platform,
    keepAliveInterval: 30,
    debug: false,
    kairos: {
      cid: config.fortnite.cid[0] ? config.fortnite.cid[0] : config.fortnite.cid,
      privacy: Enums.PartyPrivacy.PUBLIC,
    },
    auth: {},
  };

  const client = new Discord.Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.commands = new Collection();
  client.aliases = new Collection();
  
  client.slashcommands = new Collection();


  const fs = require('fs');
  const functions = fs.readdirSync('./src/functions').filter((file) => file.endsWith('.js'));
  const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));
  const commandFolders = fs.readdirSync('./src/slcommands');

  ['command'].forEach((handler) => {
    require(`./${handler}`)(client);
  });

  try {
    Options.auth.deviceAuth = JSON.parse(await readFile('./deviceAuth.json'));
  } catch (e) {
    Options.auth.authorizationCode = async () =>
      Client.consoleQuestion('[SIRIUS] [FORTNITE] Please enter an authorization code: ');
  }

  const bot = new Client(Options);

  client.on('message', async (message) => {
    if (!message.content.startsWith(config.discord.prefix)) return;

    if (config.discord.ownerOnly && !config.discord.ownerIDs.includes(message.author.id)) return;

    const args = message.content.slice(config.discord.prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
      if (!bot.party) return message.channel.send('I am not in a party, please wait!');
      command.run(client, bot, message, args, getCosmetic);
    }
  });

  if (config.discord.token === 'TOKEN')
    return console.log('[SIRIUS] [DISCORD]', 'Please enter a valid token in config.js');

  bot.on('deviceauth:created', (da) => writeFile('./deviceAuth.json', JSON.stringify(da, null, 2)));

  bot.on('party:member:joined', (member) => {
    if (member.displayName === bot.user.displayName) return;
    console.log('[SIRIUS] [FORTNITE]', `${member.displayName} has joined the party. New member count: ${bot.party.members.size}.`);
    if (!config.fortnite.joinMessage || config.fortnite.joinMessage === '') return;
    const msg = config.fortnite.joinMessage.replace('%memberName%', member.displayName).replace('%memberCount%', bot.party.members.size);
    bot.party.sendMessage(msg);
  });

  bot.on('party:invite', (invite) => {
    console.log('[SIRIUS] [FORTNITE]', `Received a party invite from ${invite.sender.displayName}.`);

    if (config.fortnite.acceptInvite) {
      invite.accept();
    } else {
      invite.decline();
    }

    console.log('[SIRIUS] [FORTNITE]', `Invite from ${invite.sender.displayName} has been ${config.fortnite.acceptInvite ? 'accepted' : 'declined'}.`);
  });

  bot.on('friend:request', (request) => {
    console.log('[SIRIUS] [FORTNITE]', `Received a friend request from ${request.displayName}.`);

    if (config.fortnite.acceptFriend) {
      request.accept();
    } else {
      request.abort();
    }

    console.log('[SIRIUS] [FORTNITE]', `Friend request from ${request.displayName} has been ${config.fortnite.acceptFriend ? 'accepted' : 'declined'}.`);
  });

  bot.on('ready', () => {
    const cosmetics = {
      cid: config.fortnite.cid,
      bid: config.fortnite.bid,
      eid: config.fortnite.eid,
      pickaxe_id: config.fortnite.pickaxe_id,
    };

    bot.party.me.setOutfit(cosmetics.cid);
    bot.party.me.setBackpack(cosmetics.bid);
    bot.party.me.setEmote(cosmetics.eid);
    bot.party.me.setPickaxe(cosmetics.pickaxe_id);
  });

  await bot.login();

  for (const file of functions) {
    require(`./functions/${file}`)(client);
  }

  client.handleEvents(eventFiles, './src/events');
  
  client.login(process.env.token);


  const clientId = '1122584731498840104';
const path = require('path');
client.commandArray = [];

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./src/slcommands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./src/slcommands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
        }
        const rest = new REST({
          version: '9'
      }).setToken(process.env.token);

      (async () => {
          try {
              console.log('Started refreshing application (/) commands.');

              await rest.put(
                  Routes.applicationCommands(clientId), {
                      body: client.commandArray
                  },
              );

              console.log('Successfully reloaded application (/) commands.');
          } catch (error) {
              console.error(error);
          }
      })


    



  client.on('ready', () => {
    const replaced = config.discord.status
      .replace('%clientUserDisplayName%', bot.user.displayName)
      .replace('%PartyMemberCount%', bot.party.members.size)
      .replace('%ClientPartyUserOutfit%', bot.party.me.outfit)
      .replace('%ClientPartyUserPickaxe%', bot.party.me.pickaxe)
      .replace('%ClientPartyUserEmote%', bot.party.me.emote)
      .replace('%ClientPartyUserBackpack%', bot.party.me.backpack)
      .replace('%ClientPartyUserIsReady%', bot.party.me.isReady)
      .replace('%ClientPartyUserIsLeader%', bot.party.me.isLeader)
      .replace('%ClientUserID%', bot.id);

    client.user.setActivity(replaced, { type: config.discord.statusType });

    console.log('[SIRIUS] [DISCORD]', `Client ready as ${client.user.tag} [${client.commands.size} commands]`);
    console.log('[SIRIUS] [FORTNITE]', `Client ready as ${bot.user.displayName}.`);
  });
})();
