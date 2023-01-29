const { SlashCommandBuilder } = require('discord.js');
const client = require('../database');
// const { executiveRole } = require('../config.json');

const executiveRole = process.env.executiveRole;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Lists statistics for RevolutionUC'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        if(interaction.member._roles.includes(executiveRole)){
            (async function() {
                try {
                    const db = client.db("makeuc");
                    const numRegistrants = await db.collection("registrant").countDocuments({isCheckedIn: true});
                    console.log(numRegistrants);
    
                    await interaction.reply(`We have \`${numRegistrants}\` checked in so far! 🥳`);
                } catch(err) {
                    console.log(err.stack);
                }
                // client.close();
                // console.log('Connection closed.');
            })();
        } else {
            await interaction.reply(`‼ I am sorry but you are not allowed to execute this command ️‼ ️`); 
        }
        
	},
};