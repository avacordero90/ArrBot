/*
PirateBot
	by Luna Catastrophe
*/
const { Client, RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')
const items = require('./items.json')

var sevenSeas = {}
var shop = []
var pre = "ar!"


// THE PIRATE CLASS
// each user is a pirate.

class Pirate {
	constructor (msg) {
		this.id = msg.author.id;
		this.tag = msg.author.tag;
		this.name = msg.author.username;
		this.avatar = msg.author.avatarURL;
		this.bounty = 0;
		this.level = 1;
		this.xp = 0;
		this.hp = 100;
		this.attack = 11;
		this.defense = 10;
		this.cunning = 11;
		this.evasion = 12;
		this.gold = 50;
		this.booty = [{"voodoo doll":50}];
	}

	getStats () {
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
		Booty: ${this.booty.length} items`;
	}

	levelup () {
		if (this.xp / 100 >= this.level * 2) {
			this.level++;
			var multi = Math.trunc(Math.random());
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
		return ` The bounty on your head has risen to ${this.bounty} gold!`
	}

	exploreTreasure (r) {
		var gold = Math.trunc(this.level*r*100);
		this.gold += gold;

		var multi = Math.trunc(Math.random()*items.length)
		this.booty[this.booty.length] = items[multi];

		var reply = `You have found ${gold} gold and the following loot: ${Object.keys(items[multi])}!`
		this.xp += (multi);

		return reply + this.levelup();

	}

	pillageTreasure () {

		return;
	}

	getBooty () {
		var reply = "";
		for (var item of this.booty)
			for (const [key,value] of Object.entries(item))
				reply += `${key} (value: ${value} gold)\n`;
		console.log(reply)
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
					this.booty[this.booty.length] = value;
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
		if (roll > def && sevenSeas[foe].gold > roll * 2) {
			var profit = roll - def
			this.gold += profit;
			sevenSeas[foe].stealGold(profit);


			// THIS DOESN'T REALLY DO ANYTHING YET
			for (const [key,value] of Object.entries(sevenSeas[foe].booty)) {
				if (profit * this.level > value) {
					this.booty[key] = value;
					var booty = key;
					break;
				}
			}

			sevenSeas[foe].stealBooty(booty)

			this.xp += roll;
			if (booty) {
				return `You've received ${profit} gold while stealing from ${sevenSeas[foe].name}. You also received ${booty}!` + this.bountyup(roll) + this.levelup();
			} else {
				return `You've received ${profit} gold while stealing from ${sevenSeas[foe].name}!` + this.bountyup(roll) + this.levelup();
			}
		} else {
			return `You were unable to steal anything from ${sevenSeas[foe].name}.`		
		}
	}

	duelUser (foe) {
		var roll = Math.trunc(Math.random()*100);
		var def = Math.trunc(Math.random()*100);
		

		return;
	}

	stealGold(amount) {
		this.gold -= amount;
		return;
	}

	stealBooty(item) {
		delete this.booty[item];
		return;
	}
}


// HELP MENU

function helpMenu (msg, cmd) {

	switch (cmd[1]) {
		case "config":
			helpMenuConfig(msg);
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
			msg.reply(`\`${pre}duel <pirate>\`: Battle another pirate.`);
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

function helpMenuConfig (msg) {
	msg.reply("This function has not been set up yet.");
	return;
}

function startAdventure (msg) {
	//if pirate already exists
	if (isPirate(msg.author)) {
		//return message saying so
		var pirate = sevenSeas[msg.author.id]
		prettyReplyAvatar(msg, `You're already a pirate, Matey!\n`, pirate.getStats());
	} else {
		var pirate = new Pirate(msg);
		sevenSeas[msg.author.id] = pirate;
		prettyReplyAvatar(msg, `There's a new pirate on the seas!\n`, pirate.getStats());
	}
	// pirate.getStats(msg);
	return;
}

function getStats (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReplyAvatar(msg, msg.author.username, pirate.getStats());
	}
	return;
}

function exploreTreasure (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`)
	} else {
		var r = Math.random();
		if (r>0.30) {
			var pirate = sevenSeas[msg.author.id];
			prettyReply(msg, `${msg.author.username} is exploring for treasure...`, pirate.exploreTreasure(r));
		} else
			msg.reply("No treasure found here!");
	}
	return;
}

function pillageTreasure (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		prettyReply(msg, msg.author.username, "This function has not been set up yet!");
	}
	return;
}

function getBooty (msg) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, `${msg.author.username}'s' booty:`, pirate.getBooty());
	}
	return;
}

function sellBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, `${msg.author.username} is selling ${cmd.slice(1)}...`, pirate.sellBooty(cmd.slice(1)));

	}
	return;
}

function shopBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		if (cmd.length == 1) {
			var reply = `Welcome to the shop, ${msg.author.tag}! What would you like?\n\n`;
			var rand = Math.trunc(Math.random()* items.length)
			shop = items.slice(rand-10, rand+10)
			for (item of shop){
				console.log(item)
				reply += `${Object.keys(item)} : ${Object.values(item)} gold\n`;
			}
			reply += `\nYou can say ${pre}shop <item> to purchase any item.`;
			prettyReply(msg, "Shop", reply);
			
		} else if (cmd.length > 1) {
			var pirate = sevenSeas[msg.author.id];
			prettyReply(msg, "Shop", pirate.shopBooty(cmd.slice(1)));
		}
	}
	return;
}

function plunderUser (msg, cmd) {
	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!isPirate(target)) {
		msg.reply(`That user is not a pirate!`);
	} else if (msg.author.id == target.id) {
		msg.reply("You wanna rob yourself, mate? LOL!")
	} else {
		var pirate = sevenSeas[msg.author.id];
		prettyReply(msg, `Plundering...${target.username}`, pirate.plunderUser(target.id));
	}
	return;
}

function duelUser (msg, cmd) {


	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!isPirate(msg.author)) {
		//return message saying so
		msg.reply(`You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!isPirate(target)) {
		msg.reply(`${cmd.slice(1)} is not a pirate!`);
	} else if (msg.author.id == target.id) {
		msg.reply("You wanna fight yourself, mate? LOL!")
	} else {

		prettyReply(msg, "This function has not been set up yet!");

		// var pirate = sevenSeas[msg.author.id];
		// prettyReply(msg, `Dueling...${target.username}`, pirate.duelUser(target.id));
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

function prettyReplyAvatar (msg, title, reply) {
    var embed = new RichEmbed()
		// Set the avatar
		.setImage(msg.author.avatarURL)
		// Set the title of the field
		.setTitle(title)
		// Set the color of the embed
		.setColor(0x40e0d0)
		// Set the main content of the embed
		.setDescription(reply);
	// Send the embed to the same channel as the message
	msg.channel.send(embed);
}

function prettyReply (msg, title, reply) {
    var embed = new RichEmbed()
		// Set the title of the field
		.setTitle(title)
		// Set the color of the embed
		.setColor(0x40e0d0)
		// Set the main content of the embed
		.setDescription(reply);
	// Send the embed to the same channel as the message
	msg.channel.send(embed);
}

// STARTUP

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});



//COMMAND INTERPRETER

client.on('message', msg => {
	if (msg.content.startsWith(pre)) {
		var cmd = msg.content.replace(pre,"").split(" ");
		var cl = cmd.length;
		console.log(`Command received from ${msg.author.tag}: ${cmd}`);
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
				if (cl > 2)
					sellBooty(msg, cmd);
				break;
			case "plunder":
				if (cl == 2)
					plunderUser(msg, cmd);
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