const { SlashCommandBuilder } = require('discord.js');
const {createAudioPlayer, createAudioResource, getVoiceConnection  } = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Bocchi não fica mais tocante"),

    async execute(interaction) {
        const link = 'https://media.tenor.com/Wpz9Vcp9M4QAAAAd/bocchi-bocchi-the-rock.gif'
        

        // Obtenha a conexão de voz ativa em um canal de voz
        const connection = getVoiceConnection(interaction.guild.id);

        // Verifique se há uma conexão de voz
        if (connection) {
            // Obtenha o reprodutor de áudio da conexão de voz
            const player = connection._state.subscription.player;

            // Pare a reprodução
            player.stop();
        }
        await interaction.reply(link)

    }

}