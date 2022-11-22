const { SlashCommandBuilder } = require('discord.js');
// const { checkin, executiveRole } = require('../config.json');
const client = require('../database');

const checkin = process.env.checkin;
const executiveRole = process.env.executiveRole;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Admins can use this command to verify the check in of hackers')
        .addStringOption(option => 
            option.setName('email')
                .setDescription('email address the hacker used to register for MakeUC')
                .setRequired(true)),
    async execute(interaction){
        const email = interaction.options.getString('email');
        console.log(email);
        let reply = '';
        
        if(checkin === "close"){
            reply = "Checkin is not open yet! Please wait until checkin starts. I appreciate your patience!"
        }
        if(checkin === "open"){
            if(interaction.member._roles.includes(executiveRole)){
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
                            reply = `Hello ${registrant.fullName}, you have not checked in yet. Please enter \`/checkin <email>\` in the verification channel!`;
                            await interaction.reply(reply);
                        }
                    } catch(err) {
                        console.log(err.stack);
                    }
                    // client.close();
                    // console.log('Connection closed.');
                })();
            } else {
                await interaction.reply(`‼ I am sorry but you are not allowed to execute this command ️‼ ️`); 
            }
            
        }
    }
}