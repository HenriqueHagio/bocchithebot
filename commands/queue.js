const { SlashCommandBuilder } = require('discord.js');
const { queue } = require('./play.js'); // Importe a fila de músicas do seu código

const queues = new Map();

function getQueue(guildId) {
    if(!queues.has(guildId)) {
        queues.set(guildId, {songs: []});
    }
    return queues.get(guildId);
}

module.exports = {
  getQueue,
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Mostra a fila de músicas'),

  async execute(interaction) {
    if (queue.length === 0) {
      return interaction.reply('A fila de músicas está vazia.');
    }

    // Gere uma lista das músicas na fila
    const queueList = queue.map((music, index) => `${index + 1}. ${music}`).join('\n');

    await interaction.reply(`Fila de músicas:\n${queueList}`);
  },
};
