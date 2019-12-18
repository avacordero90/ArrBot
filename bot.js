const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')
const pre = "ar!"

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.startsWith(pre)) {
		var cmd = msg.content.replace(pre,"");
		console.log("Command sent: " + cmd);
		switch (cmd) {
			case "help":
				msg.reply("Help Menu: (etc)");
				break;
			default:
				msg.reply("Sorry, '" + cmd + "' is not a command. Please type '" + pre + "help' to learn more.");
		}
	}
});

client.login(auth.token);