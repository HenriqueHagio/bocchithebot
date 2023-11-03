const { SlashCommandBuilder } = require('discord.js');
const { queue } = require('./play.js');
const play = require('play-dl');
const wait = require('node:timers/promises').setTimeout;

const queues = new Map();

function getQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, { songs: [] });
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

        await interaction.deferReply();
        await wait(4000);
        
        const promises = queue.map(async (queueItem, index) => {
            const videoInfo = await play.video_info(queueItem);
            return `${index + 1} - ${videoInfo.video_details.title}`;
        });

        const results = await Promise.all(promises);

       
        await interaction.editReply(results.join('\n'));
    },
};
