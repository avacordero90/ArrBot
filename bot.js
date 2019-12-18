/*
PirateBot
	by Luna Catastrophe
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')

var pre = "ar!"



client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.startsWith(pre)) {
		var cmd = msg.content.replace(pre,"").split(" ");
		console.log("Command received: '" + cmd + "'");
		switch (cmd[0]) {
			case "help":
				helpMenu(msg, cmd);
				break;
			case "config":
				setConfig();
				break;
			case "start":
				startAdventure();
				break;
			case "stats":
				getStats();
				break;
			case "explore":
				exploreChannel();
				break;
			case "pillage":
				pillageTreasure();
				break;
			case "booty":
				viewBooty();
				break;
			case "plunder":
				plunderUser();
				break;					
			// default:
			// 	msg.reply("Sorry, '" + cmd + "' is not a command. Please type '" + pre + "help' to learn more.");
		}
	}
});

function helpMenu(msg, cmd) {

	switch (cmd[1]) {
		case "config":
			helpMenuConfig();
			break;
		case "start":
			msg.reply(`\`${pre}start\`: Starts your pirate adventure.`);
			break;
		case "stats":
			msg.reply(`\`${pre}stats\`: Shows your level, stats, gold, and loot amount.`);
			break;
		case "explore":
			msg.reply(`\`${pre}explore\`: Looks for treasure in the current or default channel.`);
			break;
		case "pillage":
			msg.reply(`\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.`);
			break;
		case "booty":
			msg.reply(`\`${pre}booty\`: Shows your loot stash.`);
			break;
		case "plunder":
			msg.reply(`\`${pre}plunder <pirate>\`: Attempts to steal loot and gold from another pirate.`);
			break;	
		default:
			msg.reply(`here is the PirateBot Help Menu:
				\`${pre}help\`: Brings up this menu.

				\`${pre}config\`: Set PirateBot's configuration (Admin).

				\`${pre}start\`: Starts your pirate adventure.
				
				\`${pre}stats\`: Shows your level, stats, gold, and loot amount.
				
				\`${pre}explore\`: Looks for treasure in the current or default channel.
				
				\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.
				
				\`${pre}booty\`: Shows your loot stash.
				
				\`${pre}plunder <pirate>\`: Attempts to steal loot and gold from another pirate.`);
	}

}

client.login(auth.token);