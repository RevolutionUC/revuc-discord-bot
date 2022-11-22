const { SlashCommandBuilder } = require('discord.js');
// const { checkin } = require('../config.json');
const client = require('../database');

const checkin = process.env.checkin;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkin')
		.setDescription('Hackers can check-in using this command')
        .addStringOption(option => 
            option.setName('email')
                .setDescription('email address you used to register for MakeUC')
                .setRequired(true)),
	async execute(interaction) {
        const email = interaction.options.getString('email');
        console.log(email);
		let reply = ''

		if(checkin === "closed"){
			reply = "Checkin is not open yet! Please wait until checkin starts. I appreciate your patience!"
		}
		if(checkin === "open"){
			(async function() {
				try {
					const db = client.db("makeuc");
					const registrant = await db.collection("registrant").findOne({email: email});
					
					if(!registrant){
						reply = `I could not find a registration with the email: \`${email}\`. Please make sure that the email you entered is correct!`;
						await interaction.reply(reply);
					}
					if(registrant.isCheckedIn){
						reply = `Hello ${registrant.fullName}, you already checked in!`;
						await interaction.reply(reply);
					}
					else{
						registrant.isCheckedIn = true;
						registrant.checkedInAt = new Date();
						console.log(registrant)
						await db.collection("registrant").updateOne({
							_id: registrant._id,
						}, {
							$set: {
								isCheckedIn: true, 
								checkedInAt: new Date(),	
							}
						});
						// add role to the member
						await interaction.member.roles.add('1031768007673925673')

						reply = `Hello ${registrant.fullName}, you are successfully checked in, Welcome to MakeUC!`
						await interaction.reply(reply);
					}
					console.log(registrant);
				} catch (err) {
					console.log(err.stack);
				}
				// client.close(); // Close db connection
				// console.log('Connection closed.');
			})();
		}
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
	},
};