/*
ArrBot
	by Luna Catastrophe
	Created: 12/17/2019
	Latest: 1/7/2020
	Version: 1.3.2
*/
const { Client, RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')
const util = require('./util.js')
const items = require('./items.json')
const Pirate = require('./pirate.js')

var sevenSeas = {}
var shop = []
var pre = "ar!"



// HELP MENU

function helpMenu (msg, cmd) {

	switch (cmd[1]) {
		case "config":
			helpMenuConfig(msg);
			break;
		case "start":
			util.reply(msg, "ArrBot Help", `\`${pre}start\`: Starts your pirate adventure.`);
			break;
		case "stats":
			util.reply(msg, "ArrBot Help", `\`${pre}stats\`: Shows your level, stats, gold, and loot amount.`);
			break;
		case "explore":
			util.reply(msg, "ArrBot Help", `\`${pre}explore\`: Looks for treasure in the current or default channel.`);
			break;
		case "pillage":
			util.reply(msg, "ArrBot Help", `\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.`);
			break;
		case "booty":
			util.reply(msg, "ArrBot Help", `\`${pre}booty\`: Shows your loot stash.`);
			break;
		case "sell":
			util.reply(msg, "ArrBot Help", `\`${pre}sell <item>\`: Sell an item to the shop.`);
			break;	
		case "shop":
			util.reply(msg, "ArrBot Help", `\`${pre}shop [item]\`: view the shop inventory or purchase an item.`);
			break;	
		case "rob":
			util.reply(msg, "ArrBot Help", `\`${pre}rob <pirate>\`: Attempts to steal loot and gold from another pirate.`);
			break;
		case "duel":
			util.reply(msg, "ArrBot Help", `\`${pre}duel <pirate>\`: Battle another pirate.`);
			break;	
		default:
			util.reply(msg, "ArrBot Help", `Usage:
	\`${pre}help\`: Brings up this menu.

	\`${pre}start\`: Starts your pirate adventure.
	
	\`${pre}stats\`: Shows your level, stats, gold, and loot amount.
	
	\`${pre}explore\`: Looks for treasure in the current or default channel.
	
	\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.
	
	\`${pre}booty\`: Shows your loot stash.
	
	\`${pre}sell <item>\`: Sell an item to the shop.
	
	\`${pre}shop <item>\`: view the shop inventory or purchase an item.

	\`${pre}rob <pirate>\`: Attempts to steal loot and gold from another pirate.
	
	\`${pre}duel <pirate>\`: Battle another pirate.
	
	\`${pre}config\`: Set ArrBot's configuration (Admin).
			`);
	}
}

function helpMenuConfig (msg) {
	util.reply(msg, "ArrBot", "This function has not been set up yet.");
	return;
}

function startAdventure (msg) {
	//if pirate already exists
	if (util.isUser(msg.author.id)) {
		//return message saying so
		// var pirate = new Pirate(util.getUser(msg.author.id));
		var pirate = new Pirate(util.getUser(msg.author.id));
		util.reply(msg, `You're already a pirate, Matey!\n`, pirate.getStats(), msg.author.avatarURL);
	} else {
		var pirate = new Pirate(msg);
		// sevenSeas[msg.author.id] = pirate;
		util.saveUser(msg.author.id, pirate);
		util.reply(msg, `There's a new pirate on the seas!\n`, pirate.getStats(), msg.author.avatarURL);
	}
	// pirate.getStats(msg);
	return;
}

function getStats (msg) {
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = new Pirate(util.getUser(msg.author.id));
		util.reply(msg, msg.author.username, pirate.getStats(), msg.author.avatarURL);
	}
	return;
}

function exploreTreasure (msg) {
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`)
	} else {
		var r = Math.random();
		if (r>0.30) {
			var pirate = new Pirate(util.getUser(msg.author.id));
			util.reply(msg, `${msg.author.username} is exploring for treasure...`, pirate.exploreTreasure(r));
		} else
			util.reply(msg, "ArrBot", "No treasure found here!");
	}
	return;
}

function pillageTreasure (msg) {
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		util.reply(msg, msg.author.username, "This function has not been set up yet!");
	}
	return;
}

function getBooty (msg) {
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = new Pirate(util.getUser(msg.author.id));
		var booty = pirate.getBooty();
		if (booty)
			util.reply(msg, `${msg.author.username}'s booty:`, booty);
		else
			util.reply(msg, `${msg.author.username}, you don't have any booty!`, "");

	}
	return;
}

function sellBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = new Pirate(util.getUser(msg.author.id));
		util.reply(msg, `${msg.author.username} is selling ${cmd.slice(1, cmd.length).join(" ")}...`, pirate.sellBooty(cmd.slice(1)));

	}
	return;
}

function shopBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		if (cmd.length == 1) {
			var reply = `Welcome to the shop, ${msg.author.tag}! What would you like?\n\n`;
			var rand = Math.trunc(Math.random()* items.length)
			shop = items.slice(rand-10, rand+10)
			for (item of shop){
				reply += `${Object.keys(item)} : ${Object.values(item)} gold\n`;
			}
			reply += `\nYou can say ${pre}shop <item> to purchase any item.`;
			util.reply(msg, "Shop", reply);
			
		} else if (cmd.length > 1) {
			var pirate = new Pirate(util.getUser(msg.author.id));
			util.reply(msg, "Shop", pirate.shopBooty(cmd.slice(1)));
		}
	}
	return;
}

function robUser (msg, cmd) {
	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!util.isUser(target.id)) {
		util.reply(msg, "ArrBot", `That user is not a pirate!`);
	} else if (msg.author.id == target.id) {
		util.reply(msg, "ArrBot", "You wanna rob yourself, mate? LOL!")
	} else {
		var pirate = new Pirate(util.getUser(msg.author.id));
		var targetPirate = new Pirate(util.getUser(target.id))
		util.reply(msg, `Plundering...`, pirate.robUser(targetPirate));
	}
	return;
}

function duelUser (msg, cmd) {
	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!util.isUser(msg.author.id)) {
		//return message saying so
		util.reply(msg, "ArrBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!util.isUser(target.id)) {
		util.reply(msg, "ArrBot", `That user is not a pirate!`);
	} else if (msg.author.id == target.id) {
		util.reply(msg, "ArrBot", "You wanna fight yourself, mate? LOL!")
	} else {
		var pirate = new Pirate(util.getUser(msg.author.id));
		var targetPirate = new Pirate(util.getUser(target.id))
		util.reply(msg, `Dueling...`, pirate.duelUser(targetPirate));
	}
	return;
}

function setConfig (msg) {
	util.reply(msg, "This function has not been set up yet!");
	return;
}

// STARTUP

client.on('ready', () => {
	util.log(`Logged in as ${client.user.tag}!`);
});



//COMMAND INTERPRETER

client.on('message', msg => {
	if (msg.content.startsWith(pre)) {
		var cmd = msg.content.replace(pre,"").split(" ");
		var cl = cmd.length;
		util.log(`Command received from ${msg.author.tag}: ${cmd}`);
		if (cmd[0] == "help")
			helpMenu(msg, cmd);
		if (cl==1) {
			switch (cmd[0]) {
				case "start":
					startAdventure(msg);
					break;
				case "stats":
					getStats(msg);
					break;
				case "booty":
					getBooty(msg);
					break;
				case "explore":
					exploreTreasure(msg);
					break;
				case "pillage":
					pillageTreasure(msg);
					break;
			}
		}
		switch (cmd[0]) {
			case "shop":
				if (cl >= 1)
					shopBooty(msg, cmd);
				break;
			case "sell":
				if (cl >= 2)
					sellBooty(msg, cmd);
				break;
			case "rob":
				if (cl == 2)
					robUser(msg, cmd);
				break;
			case "duel":
				if (cl == 2)
					duelUser(msg, cmd);
				break;
			case "config":
				setConfig(msg);
				break;
		}
	}
});



client.login(auth.token);