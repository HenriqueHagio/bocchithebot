const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Bocchi começa a tocar sua música")
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL da música a ser tocada.')
                .setRequired(true)),

    async execute(interaction) {
        const url = interaction.options.getString('url');

        const memberVoiceChannel = interaction.member.voice.channel;
        const botVoiceChannel = getVoiceConnection(interaction.guild.id);

        if (!memberVoiceChannel) {
            return interaction.reply('Você precisa estar em um canal de voz!');
        }

        if (botVoiceChannel && botVoiceChannel.joinConfig.channelId !== memberVoiceChannel.id) {
            return interaction.reply('O bot já está em outro canal de voz!');
        }

        const connection = joinVoiceChannel({
            channelId: memberVoiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });


        try {
            
            const linkzinho = await play.stream(url);

            console.log(`Link capturado: ${url}`);

            const resource = createAudioResource(linkzinho.stream, {
                inputType: linkzinho.type
            })

            const player = createAudioPlayer();
            connection.subscribe(player);

            player.play(resource);





            player.on('idle', () => {
                if (botVoiceChannel) {
                    // Deixe o canal de voz apenas se o bot já estava nele
                    botVoiceChannel.destroy();
                }
            });


            player.on('error', (error) => {
                console.error('Erro do player:', error);
                interaction.reply('Ocorreu um erro ao reproduzir a música.');
            });

            console.log('Bot se conectou com sucesso ao canal de voz.');
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            interaction.reply('Ocorreu um erro ao reproduzir a música.');
        }

        await interaction.reply("Bocchi esta tocante!: " + url)

    }

};
