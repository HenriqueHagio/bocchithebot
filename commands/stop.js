const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { getQueue } = require('./queue'); // Importe a fila de músicas

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Parar a reprodução de áudio"),

    async execute(interaction) {
        const link = 'https://media.tenor.com/Wpz9Vcp9M4QAAAAd/bocchi-bocchi-the-rock.gif';
        
        // Obtenha a conexão de voz ativa em um canal de voz
        const connection = getVoiceConnection(interaction.guild.id);

        // Verifique se há uma conexão de voz
        if (connection) {
            // Obtenha a fila de músicas associada à conexão
            const audioQueue = getQueue(interaction.guild.id);

            // Verifique se há uma fila de reprodução
            if (audioQueue) {
                // Limpe a fila de reprodução
                audioQueue.songs = [];
                // Pare a reprodução atual
                connection.destroy();
            }
        }

        await interaction.reply(link);
    }
};
