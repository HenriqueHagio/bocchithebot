const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bocchi")
        .setDescription("Bocchi se esconde"),

    async execute(interaction) {
        const link = 'https://media.tenor.com/7Qm_N-yb51IAAAAd/bocchi-the-rock-hitori-gotou.gif'
        await interaction.reply(link)
    }
}