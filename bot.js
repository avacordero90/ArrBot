/*
PirateBot - bot.js
	by Luna Catastrophe
	Created: 12/17/2019
	Latest: 12/30/2019
	Version: 1.2.2
*/

const { Client, RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const discClient = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const readlineSync = require('readline-sync');
const auth = require('./auth.json');
const items = require('./items.json');
const Pirate = require('./pirate.js');
const mongo = require('./mongo.js')

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
			prettyReply(msg, "PirateBot Help", `\`${pre}start\`: Starts your pirate adventure.`);
			break;
		case "stats":
			prettyReply(msg, "PirateBot Help", `\`${pre}stats\`: Shows your level, stats, gold, and loot amount.`);
			break;
		case "explore":
			prettyReply(msg, "PirateBot Help", `\`${pre}explore\`: Looks for treasure in the current or default channel.`);
			break;
		case "pillage":
			prettyReply(msg, "PirateBot Help", `\`${pre}pillage\`: Snatches up treasure and adds it to your loot stash.`);
			break;
		case "booty":
			prettyReply(msg, "PirateBot Help", `\`${pre}booty\`: Shows your loot stash.`);
			break;
		case "sell":
			prettyReply(msg, "PirateBot Help", `\`${pre}sell <item>\`: Sell an item to the shop.`);
			break;	
		case "shop":
			prettyReply(msg, "PirateBot Help", `\`${pre}shop [item]\`: view the shop inventory or purchase an item.`);
			break;	
		case "plunder":
			prettyReply(msg, "PirateBot Help", `\`${pre}plunder <pirate>\`: Attempts to steal loot and gold from another pirate.`);
			break;
		case "duel":
			prettyReply(msg, "PirateBot Help", `\`${pre}duel <pirate>\`: Battle another pirate.`);
			break;	
		default:
			prettyReply(msg, "PirateBot Help", `Usage:
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
	prettyReply(msg, "PirateBot", "This function has not been set up yet.");
	return;
}

function startAdventure (msg) {
	dbClient.connect(err => {
		const pirates = dbClient.db("PirateBot").collection("Pirates");

		var pirate = pirates.findOne({"id": msg.author.id}, function(err, result) {
			if (err) throw err;
			// console.log(result);

			//if pirate already exists
			if (result) {
				//return message saying so
				prettyReplyAvatar(msg, `You're already a pirate, Matey!\n`, result);
			} else {
				var pirate = new Pirate(msg);
				mongo.insertPirate(pirates, pirate);
				prettyReplyAvatar(msg, `There's a new pirate on the seas!\n`, pirate);
			}
		});
	});

	return;
}



// CONTINUE CODING HERE!



function getStats (msg) {
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = mongo.getPirate(pirates, msg.author.id);
		prettyReplyAvatar(msg, msg.author.username, pirate.getStats());
	}
	return;
}

function exploreTreasure (msg) {
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`)
	} else {
		var r = Math.random();
		if (r>0.30) {
			var pirate = mongo.getPirate(pirates, msg.author.id);
			prettyReply(msg, `${msg.author.username} is exploring for treasure...`, pirate.exploreTreasure(r));
			mongo.updatePirate(pirates, pirate);
		} else
			prettyReply(msg, "PirateBot", "No treasure found here!");
	}
	return;
}

function pillageTreasure (msg) {
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		prettyReply(msg, msg.author.username, "This function has not been set up yet!");
		// pirates.insertOne(pirate);
	}
	return;
}

function getBooty (msg) {
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = mongo.getPirate(pirates, msg.author.id);
		var booty = pirate.getBooty();
		if (booty)
			prettyReply(msg, `${msg.author.username}'s booty:`, booty);
		else
			prettyReply(msg, `${msg.author.username}, you don't have any booty!`, "");
	}
	return;
}

function sellBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		var pirate = mongo.getPirate(pirates, msg.author.id);
		prettyReply(msg, `${msg.author.username} is selling ${cmd.slice(1)}...`, pirate.sellBooty(cmd.slice(1)));
		mongo.updatePirate(pirates, pirate);
	}
	return;
}

function shopBooty (msg, cmd) {
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else {
		if (cmd.length == 1) {
			var reply = `Welcome to the shop! What would you like?\n\n`;
			var rand = Math.trunc(Math.random()* items.length)
			shop = items.slice(rand-10, rand+10)
			for (item of shop){
				reply += `${Object.keys(item)} : ${Object.values(item)} gold\n`;
			}
			reply += `\nYou can say "${pre}shop <item>" to purchase any item.`;
			prettyReply(msg, "Shop", reply);
			
		} else if (cmd.length > 1) {
			var pirate = mongo.getPirate(pirates, msg.author.id);
			prettyReply(msg, "Shop", pirate.shopBooty(cmd.slice(1)));
			mongo.updatePirate(pirates, pirate);
		}
	}
	return;
}

function plunderUser (msg, cmd) {
	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!mongo.isPirate(target)) {
		prettyReply(msg, "PirateBot", `That user is not a pirate!`);
	} else if (msg.author.id == target.id) {
		prettyReply(msg, "PirateBot", "You wanna rob yourself, mate? LOL!")
	} else {
		var pirate = mongo.getPirate(pirates, msg.author.id);
		prettyReply(msg, `Plundering...`, pirate.plunderUser(target.id));
		mongo.updatePirate(pirates, pirate);
	}
	return;
}

function duelUser (msg, cmd) {
	target = msg.mentions.members.first()
	//if pirate doesn't exists
	if (!mongo.isPirate(pirates, msg.author.id)) {
		//return message saying so
		prettyReply(msg, "PirateBot", `You're not yet a pirate! Type ${pre}start to begin your adventure!`);
	} else if (!mongo.isPirate(target)) {
		prettyReply(msg, "PirateBot", `That user is not a pirate!`);
	} else if (msg.author.id == target.id) {
		prettyReply(msg, "PirateBot", "You wanna fight yourself, mate? LOL!")
	} else {
		var pirate = mongo.getPirate(pirates, msg.author.id);
		prettyReply(msg, `Dueling...`, pirate.duelUser(target.id));
		mongo.updatePirate(pirates, pirate);
	}
	return;
}

function setConfig (msg) {
	prettyReply(msg, "This function has not been set up yet!");
	return;
}

function prettyReplyAvatar (msg, title, reply) {
    var embed = new RichEmbed()
		// Set the avatar
		.setImage(msg.author.avatarURL)
		// Set the title of the field
		.setTitle(title)
		// Set the color of the embed
		.setColor(0x40e0d0)
		//	 Set the main content of the embed
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

discClient.on('ready', () => {
	// mongo.connect();
	console.log(`Logged in as ${discClient.user.tag}!`);
});



//COMMAND INTERPRETER

discClient.on('message', msg => {
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
				if (cl >= 2)
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


const dbClient = mongo.dbConnect()

// console.log(pirates);

discClient.login(auth.token);


