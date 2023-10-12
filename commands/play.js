const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
} = require('@discordjs/voice');
const play = require('play-dl');

// Lista de músicas em fila
const queue = [];

module.exports = {
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

    // Adicione a música atual à fila
    queue.push(url);

    if (queue.length === 1) {
      // Se a fila estiver vazia, inicie a reprodução
      playNextSong(connection);
    }

    await interaction.reply("Bocchi está tocando!: " + url);
  }
};

async function playNextSong(connection) {
  if (queue.length === 0) {
    // Nada na fila, saia da função
    return;
  }
  const url = queue[0];

  try {

    const linkzinho = await play.stream(url);

    console.log(`Link capturado: ${url}`);

    const resource = createAudioResource(linkzinho.stream, {
      inputType: linkzinho.type
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    player.play(resource);

    player.on('idle', () => {
      // Remova a primeira música da fila
      queue.shift();

      if (queue.length > 0) {
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