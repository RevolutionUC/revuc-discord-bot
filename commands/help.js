const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all the commands registered with MakeIt.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

        let listOfCommands = "";

        for (const [key, value] of interaction.client.commands) {
            listOfCommands += `\`/${key} -> ${value.data.description}\`\n`;
        }

		await interaction.reply(`Here's a list of commands you could try:\n ${listOfCommands}`);
	},
};