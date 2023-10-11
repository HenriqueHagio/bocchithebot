const { SlashCommandBuilder } = require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Bocchi está descansando"),

    async execute(interaction) {
        

        // Obtenha a conexão de voz ativa em um canal de voz
        const connection = getVoiceConnection(interaction.guild.id);

        // Verifique se há uma conexão de voz
        if (connection) {
            // Obtenha o reprodutor de áudio da conexão de voz
            const player = connection._state.subscription.player;

            // Pause a reprodução
            player.pause();
        }
        await interaction.reply("Bocchi foi descansar")

    }

}