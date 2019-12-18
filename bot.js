/*
PirateBot
	by Luna Catastrophe
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')

var sevenSeas = {}
var pre = "ar!"



class Pirate {
	constructor (msg) {
		this.name = msg.author.username;
		this.level = 1;
		this.xp = 0;
		this.gold = 500;
		this.booty = {"Voodoo Doll":50};
	}

	getStats () {
		var count = Object.keys(this.booty).length;
		return `Here are your Stats:
			Level: ${this.level}
			XP: ${this.xp}
			Gold: ${this.gold}
			Booty: ${count} items`;
	}

	exploreChannel () {
		return
	}

	pillageTreasure () {
		return
	}

	getBooty () {
		var reply = "Here's your stash of booty:\n"
		for (const [key,value] of Object.entries(this.booty))
			reply += `${key} (value: ${value} gold)`
		return reply
	}

	plunderUser () {
		return
	}

	duelUser () {
		return
	}
}

function helpMenu (msg, cmd) {

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
		case "duel":
			msg.reply(`\`${pre}plunder <pirate>\`: Battle another pirate.`);
			break;	
		default:
			msg.reply(`here is the PirateBot Help Menu:
				\`${pre}help\`: Brings up this menu.

				\`${pre}start\`: Starts your pirate adventure.
				
				\`${pre}stats\`: Shows your level, stats, gold, and loot amount.
				
				\`${pre}explore\`: Looks for treasure in the current or default channel.
				
				\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.
				
				\`${pre}booty\`: Shows your loot stash.
				
				\`${pre}plunder <pirate>\`: Attempts to steal loot and gold from another pirate.
				
				\`${pre}duel <pirate>\`: Battle another pirate.
				
				\`${pre}config\`: Set PirateBot's configuration (Admin).
				`);
	}
}

function startAdventure (msg) {
	//if pirate already exists
	if (isPirate(msg)) {
		//return message saying so
		var pirate = sevenSeas[msg.author.username]
		msg.reply(`You're already a pirate, Matey!\n` + pirate.getStats());
	} else {
		var pirate = new Pirate(msg);
		sevenSeas[msg.author.username] = pirate;
		msg.reply(`There's a new pirate on the seas! Make way for ${pirate.name}!\n` + pirate.getStats())	;	
	}
	return;
}

function getStats (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! type ${pre}start to begin your adventure!`)
	} else {
		var pirate = sevenSeas[msg.author.username]
		msg.reply(pirate.getStats())
	}
	return;
}

function exploreChannel (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! type ${pre}start to begin your adventure!`)
	} else {
		msg.reply("This function has not been set up yet!")
	}
	return;
}

function pillageTreasure (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! type ${pre}start to begin your adventure!`)
	} else {
		msg.reply("This function has not been set up yet!")
	}
	return;
}

function getBooty (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! type ${pre}start to begin your adventure!`)
	} else {
		var pirate = sevenSeas[msg.author.username]
		msg.reply(pirate.getBooty())
	}
	return;
}

function plunderUser (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! type ${pre}start to begin your adventure!`)
	} else {
		msg.reply("This function has not been set up yet!")
	}
	return;
}

function duelUser (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! type ${pre}start to begin your adventure!`)
	} else {
		msg.reply("This function has not been set up yet!")
	}
	return;
}

function setConfig (msg) {
	msg.reply("This function has not been set up yet!")
	return;
}

function isPirate (msg) {
	return msg.author.username in sevenSeas;
}



client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.startsWith(pre)) {
		var cmd = msg.content.replace(pre,"").split(" ");
		console.log(`Command received from ${msg.author.tag}: ${cmd}`);

		if (cmd.length == 1) {
			switch (cmd[0]) {
				case "help":
					helpMenu(msg, cmd);
					break;
				case "start":
					startAdventure(msg);
					break;
				case "stats":
					getStats(msg);
					break;
				case "explore":
					exploreChannel(msg);
					break;
				case "pillage":
					pillageTreasure(msg);
					break;
				case "booty":
					getBooty(msg);
					break;
			}
		} else if (cmd.length == 2) {
			switch (cmd[0]) {
				case "plunder":
					plunderUser(msg);
					break;
				case "duel":
					duelUser(msg);
					break;
			}
		} else {
			switch (cmd[0]) {
				case "config":
					setConfig(msg);
					break;
			}
		}
	}
});



client.login(auth.token);