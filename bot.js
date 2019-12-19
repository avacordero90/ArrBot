/*
PirateBot
	by Luna Catastrophe
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')
const items = require('./items.json')

var sevenSeas = {}
var shop = []
var pre = "ar!"



class Pirate {
	constructor (msg) {
		this.id = msg.author.id
		this.tag = msg.author.tag
		this.name = msg.author.username;
		this.bounty = 0;
		this.level = 1;
		this.xp = 0;
		this.hp = 100;
		this.attack = 11;
		this.defense = 10;
		this.cunning = 11;
		this.evasion = 12;
		this.gold = 50;
		this.booty = {"voodoo doll":50};
	}

	getStats () {
		var count = Object.keys(this.booty).length;
		return `Name: ${this.name}
		Bounty: ${this.bounty} gold
		Level: ${this.level}
		XP: ${this.xp}
		HP: ${this.hp}
		Attack: ${this.attack}
		Defense: ${this.defense}
		Cunning: ${this.cunning}
		Evasion: ${this.evasion}
		Gold: ${this.gold}
		Booty: ${count} items`;
	}

	levelup () {
		if (this.xp / 100 >= this.level * 2) {
			this.level++;
			var multi = Math.trunc(Math.random()*100);
			this.hp += Math.trunc(1.1 * multi);
			this.attack += Math.trunc(1.2 * multi);
			this.defense += Math.trunc(1.1 * multi);
			this.cunning += Math.trunc(1.2 * multi);
			this.evasion += Math.trunc(1.3 * multi);

			return ` You have reached level ${this.level}!`;
		} else
			return "";
	}

	bountyup (crime) {
		this.bounty += crime;
		return `The bounty on your head has risen to ${this.bounty}!`
	}

	exploreTreasure (r) {
		var gold = Math.trunc(this.level*r*100);
		this.gold += gold;

		var multi = Math.trunc(Math.random()*items.length)
		var booty = items[multi];
		this.booty[Object.keys(booty)] = Object.values(booty);

		var reply = `You have found ${gold} gold and the following loot: ${Object.keys(booty)}!`
		this.xp += (multi);

		return reply + this.levelup();

	}

	pillageTreasure () {

		return;
	}

	getBooty () {
		var reply = "Here's your stash of booty:\n"
		for (const [key,value] of Object.entries(this.booty))
			reply += `${key} (value: ${value} gold)\n`;
		return reply;
	}

	sellBooty (item) {
		item = item.join(" ");
		if (item in this.booty) {
			var reply = `You have sold ${item} for ${this.booty[item]} gold.`
			this.gold += parseInt(this.booty[item]);
			delete this.booty[item];
			return reply;
		} else {
			return `${item} not found.`
		}
	}

	shopBooty (item) {
		item = item.join(" ");

		for (const [key, value] of Object.entries(shop)) {
			if (item in value) {
				var val = Object.values(value)
				if (this.gold >= val) {
					this.booty[item] = val;
					this.gold -= val;
					return `You've purchased ${item} for ${val} gold!`;
				} else {
					return `You don't have enough gold to buy ${item}!`;
				}
			}
		}
		return `${item} is not in stock.`;
	}

	plunderUser (foe) {
		var roll = Math.trunc(Math.random()*100);
		var def = Math.trunc(Math.random()*100);
		if (roll > def) {
			var profit = roll - def
			this.gold += profit;
			sevenSeas[foe].stealGold(profit);
			this.xp += roll;
			return `You've received ${profit} gold stealing from ${sevenSeas[foe].name}!` + this.bountyup(roll) + this.levelup();
		} else {
			return `You were unable to steal any gold from ${sevenSeas[foe].name}.`		
		}
	}

	stealGold(amount) {
		this.gold -= amount;
		return;
	}

	duelUser (foe) {

		return;
	}
}


// HELP MENU

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
		case "sell":
			msg.reply(`\`${pre}sell <item>\`: Sell an item to the shop.`);
			break;	
		case "shop":
			msg.reply(`\`${pre}shop [item]\`: view the shop inventory or purchase an item.`);
			break;	
		case "plunder":
			msg.reply(`\`${pre}plunder <pirate>\`: Attempts to steal loot and gold from another pirate.`);
			break;
		case "duel":
			msg.reply(`\`${pre}plunder <pirate>\`: Battle another pirate.`);
			break;	
		default:
			msg.reply(`PirateBot Command List:
	\`${pre}help\`: Brings up this menu.

	\`${pre}start\`: Starts your pirate adventure.
	
	\`${pre}stats\`: Shows your level, stats, gold, and loot amount.
	
	\`${pre}explore\`: Looks for treasure in the current or default channel.
	
	\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.
	
	\`${pre}booty\`: Shows your loot stash.
	
	\`${pre}sell <item>\`: Sell an item to the shop.
	
	\`${pre}shop <item>\`: view the shop inventory or purchase an item.

	\`${pre}plunder <pirate>\`: Attempts to steal loot and gold from another pirate.
	
	\`${pre}duel <pirate>\`: Battle another pirate.
	
	\`${pre}config\`: Set PirateBot's configuration (Admin).
				`);
	}
}

function startAdventure (msg) {
	//if pirate already exists
	if (isPirate(msg.author)) {
		//return message saying so
		var pirate = sevenSeas[msg.author.id]
		prettyReply(msg, `You're already a pirate, Matey!\n` + pirate.getStats());
	} else {
		var pirate = new Pirate(msg);
		sevenSeas[msg.author.id] = pirate;
		prettyReply(msg, `There's a new pirate on the seas! Make way for ${pirate.name}!\n` + pirate.getStats());	
	}
	return;
}

function getStats (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, pirate.getStats());
	}
	return;
}

function exploreTreasure (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`)
	} else {
		var r = Math.random();
		if (r>0.30) {
			var pirate = sevenSeas[msg.author.id];
			prettyReply(msg, pirate.exploreTreasure(r));
		} else
			prettyReply(msg, "No treasure found here!");
	}
	return;
}

function pillageTreasure (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		prettyReply(msg, "This function has not been set up yet!");
	}
	return;
}

function getBooty (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, pirate.getBooty());
	}
	return;
}

function sellBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, pirate.sellBooty(cmd.slice(1)));

	}
	return;
}

function shopBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		if (cmd.length == 1) {
			var reply = "Welcome to the shop! What would you like?\n";
			var rand = Math.trunc(Math.random()* items.length)
			shop = items.slice(rand-10, rand+10)
			for (item of shop){
				// console.log(item)
				reply += `${Object.keys(item)} : ${Object.values(item)} gold\n`;
			}
			reply += `You can say ${pre}shop <item> to purchase any item.`;
			prettyReply(msg, reply);
			
		} else if (cmd.length > 1) {
			var pirate = sevenSeas[msg.author.id];
			prettyReply(msg, pirate.shopBooty(cmd.slice(1)));
		}
	}
	return;
}

function plunderUser (msg, cmd) {
	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!isPirate(target)) {
		prettyReply(msg, `${cmd.slice(1)} is not a pirate!`);
	} else if (msg.author.id == target.id) {
		prettyReply(msg, "You wanna rob yourself mate? LOL!")
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, pirate.plunderUser(msg.mentions.members.first().id));
	}
	return;
}

function duelUser (msg, cmd) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		prettyReply(msg, `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		prettyReply(msg, "This function has not been set up yet!");
	}
	return;
}

function setConfig (msg) {
	prettyReply(msg, "This function has not been set up yet!");
	return;
}

// CHECK IF MSG SENDER IS A PIRATE

function isPirate (user) {
	if (user) {
		return (user.id in sevenSeas);
	}
}

function prettyReply (msg, reply) {
	msg.reply(`\`\`\`${reply}\`\`\``);
}

// STARTUP

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});



//COMMAND INTERPRETER

client.on('message', msg => {
	if (msg.content.startsWith(pre)) {
		var cmd = msg.content.replace(pre,"").split(" ");
		console.log(`Command received from ${msg.author.tag}: ${cmd}`);

		// if (cmd.length == 1) {
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
					exploreTreasure(msg);
					break;
				case "pillage":
					pillageTreasure(msg);
					break;
				case "booty":
					getBooty(msg);
					break;
				case "sell":
					sellBooty(msg, cmd);
					break;
				case "shop":
					shopBooty(msg, cmd);
					break;
				case "plunder":
					plunderUser(msg, cmd);
					break;
				case "duel":
					duelUser(msg, cmd);
					break;
				case "config":
					setConfig(msg);
					break;
			}
		// }
	}
});



client.login(auth.token);