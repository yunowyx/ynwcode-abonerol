const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Slash komutunu kaydetme
const commands = [
    new SlashCommandBuilder()
        .setName('abone')
        .setDescription('Abone rolünü almanı sağlar'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Slash komutları kaydediliyor...');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log('Slash komutları başarıyla kaydedildi.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Bot giriş yaptı: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'abone') {
        const role = interaction.guild.roles.cache.find(r => r.name === 'Abone');
        if (!role) {
            return interaction.reply('Abone rolü bulunamadı. Lütfen bir "Abone" rolü oluşturun.');
        }

        const member = interaction.member;
        if (member.roles.cache.has(role.id)) {
            return interaction.reply('Zaten Abone rolüne sahipsin!');
        } else {
            await member.roles.add(role);
            return interaction.reply('Abone rolünü başarıyla aldın!');
        }
    }
});

client.login(config.token);
