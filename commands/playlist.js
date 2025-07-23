const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} = require('@discordjs/voice');
const play = require('@distube/ytdl-core');
const playdl = require('play-dl');
// Lista de músicas em fila
const queuePlaylist = [];

module.exports = {
  queuePlaylist,
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Bocchi começa a tocar sua playlist")
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URL da playlist a ser tocada.')
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString('url');

    const playlist = await playdl.playlist_info(url)
    const musicas = await playlist.all_videos()


    const memberVoiceChannel = interaction.member.voice.channel;
    const botVoiceChannel = getVoiceConnection(interaction.guild.id);

    if (!memberVoiceChannel) {
      return interaction.reply('Você precisa estar em um canal de voz!');
    }

    if (botVoiceChannel && botVoiceChannel.joinConfig.channelId !== memberVoiceChannel.id) {
      return interaction.reply('Bocchi já está em outro canal de voz!');
    }

    const connection = joinVoiceChannel({
      channelId: memberVoiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    
    for (const musica of musicas){
        queuePlaylist.push(musica.url)
    }

    // if (queuePlaylist.length === 1) {
      // Se a fila estiver vazia, inicie a reprodução
    playNextSong(connection);
    // }

    await interaction.reply("Albúm de Bocchi!: " + url);
  }
};

async function playNextSong(connection) {
  if (queuePlaylist.length === 0) {
    // Nada na fila, saia da função
    return;
  }
  
  const url = queuePlaylist[0];

  try {

    const linkzinho = play(url, { filter: 'audioonly', fmt:'mp3', highWaterMark: 1 << 62})

    const resource = createAudioResource(linkzinho)

    const player = createAudioPlayer();
    connection.subscribe(player);

    player.play(resource);

    player.on('idle', () => {
      // Remova a primeira música da fila
      queuePlaylist.shift();

      if (queuePlaylist.length > 0) {
        // Se houver mais músicas na fila, toque a próxima
        playNextSong(connection);
      } else {
        // Caso contrário, saia do canal de voz
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