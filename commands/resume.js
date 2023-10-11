const { SlashCommandBuilder } = require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Bocchi voltou a ficar tocante"),

    async execute(interaction) {
        const link = 'https://media.tenor.com/uDVl2mD3ZI8AAAAC/bocchi-the-rock.gif'


        // Obtenha a conexão de voz ativa em um canal de voz
        const connection = getVoiceConnection(interaction.guild.id);

        // Verifique se há uma conexão de voz
        if (connection) {
            // Obtenha o reprodutor de áudio da conexão de voz
            const player = connection._state.subscription.player;

            // Volta a reprodução
            player.unpause();
        }
        await interaction.reply(link);

    }

}