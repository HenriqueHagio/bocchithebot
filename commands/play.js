const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const playdl = require('play-dl');
const queue = [];

function isYouTubeUrl(text) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(text);
}

module.exports = {
  queue,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Bocchi começa a tocar sua música")
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URL da música a ser tocada.')
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString('url');
    const memberVoiceChannel = interaction.member.voice.channel;
    const botVoiceChannel = getVoiceConnection(interaction.guild.id);

    if (!memberVoiceChannel) {
      return interaction.reply('Você precisa estar em um canal de voz!');
    }

    if (botVoiceChannel && botVoiceChannel.joinConfig.channelId !== memberVoiceChannel.id) {
      return interaction.reply('O bot já está em outro canal de voz!');
    }

    const connection = joinVoiceChannel({
      channelId: memberVoiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    if(isYouTubeUrl(url)) {
      queue.push(url);
    }
    else{
      const term = await playdl.search(url)
      queue.push(term[0].url);
    }

    if (queue.length === 1) {
      playNextSong(connection);
    }

    await interaction.reply("Bocchi está tocando!: " + url);
  }
};

async function playNextSong(connection) {
  if (queue.length === 0) {
    return;
  }
  const url = queue[0];

  try {
      
    
    const video = ytdl(url, { filter: 'audioonly', fmt:'mp3', highWaterMark: 1 << 62})
   
    const resource = createAudioResource(video)

    const player = createAudioPlayer();
    connection.subscribe(player);

    player.play(resource);
  

    player.on('idle', () => {
      queue.shift();
      if (queue.length > 0) {
        playNextSong(connection);
      } else {
        if (connection) {
          connection.destroy();
        }
      }
    });

    player.on('error', (error) => {
      console.error('Erro do player:', error);
    });
  } catch (error) {
      console.error('Erro ao reproduzir música:', error);
  }
}