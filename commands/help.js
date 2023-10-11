const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Tutorial da Bocchi"),

    async execute(interaction) {
        await interaction.reply("O-Olá seja b-bem-vindo ao B-bocchi the Bot! \n" +
        "Segue abaixo um pequeno guia dos comandos \n" +
        "/play + link do youtube --> use este comando para tocar a sua música \n" +
        "/pause ---> use este comando para... hmm... pausar sua música ta meio óbvio esse " +
        "/resume ---> para voltar a tocar sua música \n" +
        "/stop ---> para CALAR A BOCA DA BOCCHI (faça com carinho se não nunca mais ela abre a boca ) \n" +
        "/quit ---> para EXPULSAR A BOCCHI DA SUA CALL SEU SEM CORAÇÃO" 
        );
    }
}