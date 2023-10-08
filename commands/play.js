const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, generateDependencyReport } = require('@discordjs/voice');
const ytdl = require('ytdl-core');


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
            const stream = ytdl(url, { filter: 'audioonly' });
            console.log(`Link capturado: ${url}`);

            const audioResource = createAudioResource(stream);
            
            const player = createAudioPlayer();
            connection.subscribe(player);

            player.play(audioResource);
        
            console.log('Bot está se conectando ao canal de voz...');
        
        
            player.on('idle', () => {
                if (botVoiceChannel) {
                    // Deixe o canal de voz apenas se o bot já estava nele
                    botVoiceChannel.destroy();
                }
            });

            console.log(generateDependencyReport());
        
            player.on('error', (error) => {
                console.error('Erro do player:', error);
                interaction.reply('Ocorreu um erro ao reproduzir a música.');
            });
        
            console.log('Bot se conectou com sucesso ao canal de voz.');
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            interaction.reply('Ocorreu um erro ao reproduzir a música.');
        }
    }
};
