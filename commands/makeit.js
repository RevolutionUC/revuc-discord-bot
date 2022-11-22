const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('makeit')
		.setDescription('Provides information about the MakeUC Discord Bot'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply("Hi! I am the official bot for MakeUC 2022! \nI can assist you check in to the event. Just say `/help` to list all the things that I can do! \nGood luck and have fun hacking!");
	},
};