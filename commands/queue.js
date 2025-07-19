const { SlashCommandBuilder } = require('discord.js');
const { queue } = require('./play.js');
const { queuePlaylist } = require('./playlist.js');

const ytdl = require('@distube/ytdl-core');
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
        .setDescription('Mostrar a fila de músicas'),

    async execute(interaction) {
        if (queue.length === 0 && queuePlaylist.length === 0) {
            return interaction.reply('A fila de músicas está vazia.');
        }

        await interaction.deferReply();
        await wait(60000);

        let queueToDisplay = queue;
        if (queuePlaylist.length > 0) {
            queueToDisplay = queuePlaylist;
        }

        const limit = Math.min(queueToDisplay.length, 10);
        const promises = [];
        promises.push("AQUI ESTÁ AS 10 PROXIMAS MUSICAS:")
        for (let index = 0; index < limit; index++) {
            const queueItem = queueToDisplay[index];
            const videoInfo = await play.video_info(queueItem);
            promises.push(`${index + 1} - ${videoInfo.video_details.title}`);
        }

        const results = await Promise.all(promises);

        await interaction.editReply(results.join('\n'));
    },
};
