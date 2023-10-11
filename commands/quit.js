const { SlashCommandBuilder } = require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Bocchi vai embora"),

    async execute(interaction) {
        const link = 'https://media.tenor.com/oG5fnlgNih4AAAAd/bocchi-bocchi-the-rock.gif'


        // Obtenha a conexão de voz ativa em um canal de voz
        const connection = getVoiceConnection(interaction.guild.id);

        // Verifique se há uma conexão de voz
        if (connection) {

            // Volta a reprodução
            connection.destroy();
        }
        await interaction.reply(link);

    }

}