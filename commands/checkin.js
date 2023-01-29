const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');
// const { checkin } = require('../config.json');
require('dotenv').config();
const checkin = process.env.checkin;
const api_token = process.env.api_token;
const hacker_role = process.env.hackerRole;
// console.log(api_token);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkin')
		.setDescription('Hackers can check-in using this command')
        .addStringOption(option => 
            option.setName('email')
                .setDescription('email address you used to register for RevolutionUC')
                .setRequired(true)),
	async execute(interaction) {
        const email = interaction.options.getString('email');
        console.log(email);
		let reply = ''

		if(checkin === "closed"){
			reply = "Checkin is not open yet! Please wait until checkin starts. I appreciate your patience!"
			await interaction.reply(reply);
		}
		if(checkin === "open"){
			(async function() {
					try{
						const registrant = await axios.post('https://web-production-66b6.up.railway.app/api/v2/attendee/checkin', 
						{email: email},
						{
						
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${api_token}`,
							},
						});
						console.log(registrant);
						if(registrant.data.checkedIn){
							await interaction.member.roles.add(hacker_role);
							reply = `Hello ${registrant.data.name}, you are successfully checked in, Welcome to RevolutionUC!`;
							await interaction.reply(reply);
						}
					} catch (error) {
						console.log(error);
						if(error.response.data.statusCode === 404){
							reply = `The following email was not found: \`${email}\`. Please use the email you used to register for RevolutionUC!`
							await interaction.reply(reply);
						}
						if(error.response.data.statusCode === 403){
							reply = `You are already checkedin!`
							await interaction.reply(reply);
						}
					}
			})();
		}
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
	},
};