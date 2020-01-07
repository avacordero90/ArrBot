/*
PirateBot - pirate.js
	by Luna Catastrophe
	Created: 12/17/2019
	Latest: 1/7/2020
	Version: 1.3.2
*/

// THE PIRATE CLASS
// each discord user is a pirate.

const items = require('./items.json');
const util = require('./util.js');

class Pirate {
	constructor (msg) {
		if ("author" in msg) {
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
		} else {
			this.id = msg.id;
			this.tag = msg.tag;
			this.name = msg.name;
			this.avatar = msg.avatar;
			this.bounty = msg.bounty;
			this.level = msg.level;
			this.xp = msg.xp;
			this.hp = msg.hp;
			this.attack = msg.attack;
			this.defense = msg.defense;
			this.cunning = msg.cunning;
			this.evasion = msg.evasion;
			this.gold = msg.gold;
			this.booty = msg.booty;
		}
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
		Booty: ${this.booty.length} item(s)`;
	}

	levelup () {
		if (this.xp / 100 >= this.level) {
			this.level++;
			var multi = Math.trunc(Math.random());
			this.hp += Math.trunc(1.1 * multi);
			this.attack += Math.trunc(1.2 * multi);
			this.defense += Math.trunc(1.1 * multi);
			this.cunning += Math.trunc(1.2 * multi);
			this.evasion += Math.trunc(1.3 * multi);

			util.saveUser(this.id, this);

			return ` You have reached level ${this.level}!`;
		} else
			return "";
	}

	bountyup (crime) {
		this.bounty += crime;
		util.saveUser(this.id, this);
		
		return ` The bounty on your head has risen to ${this.bounty} gold!`
	}

	exploreTreasure (r) {
		var gold = Math.trunc(this.level*r*100);
		this.gold += gold;

		var multi = Math.trunc(Math.random()*items.length)
		this.booty[this.booty.length] = items[multi];

		var reply = `You have found ${gold} gold and the following loot: ${Object.keys(items[multi])}!`
		this.xp += (multi);

		util.saveUser(this.id, this);

		return reply + this.levelup();

	}

	pillageTreasure () {

		return;
	}

	getBooty () {
		var reply = "";
		if (this.booty) {
			for (var item of this.booty) {
				for (const [key,value] of Object.entries(item))
					reply += `${key} (value: ${value} gold)\n`;
			}
			return reply;	
		}
		
	}

	sellBooty (item) {
		item = item.join(" ");
		for (var thing of this.booty) {
			for (const [key, value] of Object.entries(thing)) {
				if (item == key) {
					this.gold += parseInt(value);
					var index = this.booty.indexOf(thing);
					this.booty.splice(index,1);
					util.saveUser(this.id, this);

					return `You've sold ${key} for ${value} gold!`;
				}
			}
		}
		return `${item} not found.`;
	}

	shopBooty (item) {
		item = item.join(" ");

		for (const [key, value] of Object.entries(shop)) {
			if (item in value) {
				var val = Object.values(value)
				if (this.gold >= val) {
					this.booty[this.booty.length] = value;
					this.gold -= val;
					util.saveUser(this.id, this);
					
					return `You've purchased ${item} for ${val} gold!`;
				} else {
					return `You don't have enough gold to buy ${item}!`;
				}
			}
		}
		return `${item} is not in stock.`;
	}

	robUser (foe) {
		var roll = Math.trunc(Math.random()*100);
		var def = Math.trunc(Math.random()*100);
		var profit = roll - def
		if (roll > def && foe.gold >= profit * 2) {
			
			this.gold += profit
			foe.stealGold(profit);

			if (foe.booty) {
				for (var item of foe.booty) {
					for (const [key,value] of Object.entries(item)) {
						if (profit * this.level > value) {
							var loot = item;
							var booty = key;
							var plunder = 1;
						}
					}
				}
			}

			if (plunder) {
				this.booty[this.booty.length] = loot;
				foe.stealBooty(loot)
			}

			this.xp += roll;

			util.saveUser(this.id, this);

			if (booty) {
				return `You've received ${profit} gold while stealing from ${foe.name}. You also received ${booty}!` + this.bountyup(roll) + this.levelup();
			} else {
				return `You've received ${profit} gold while stealing from ${foe.name}!` + this.bountyup(profit) + this.levelup();
			}
		} else {
			return `You were unable to steal anything from ${foe.name}.`		
		}
	}

	duelUser (foe) {
		var roll = Math.trunc(Math.random()*this.level*100);
		var def = Math.trunc(Math.random()*foe.level*100);
		if (roll > def) {
			var reply = `You won the duel and earned the ${foe.bounty} gold bounty on ${foe.name}'s head!`;
			this.gold += foe.bounty;
			foe.bounty = 0;
		} else {
			var reply = `You lost the duel and ${foe.name} earned the ${this.bounty} gold bounty on your head!`;
			foe.gold += this.bounty;
			this.bounty = 0;
		}
		util.saveUser(this.id, this);
		return reply;
	}

	stealGold(amount) {
		this.gold -= amount;
		util.saveUser(this.id, this);

		return;
	}

	stealBooty(item) {
		for (var loot of this.booty) {
			if (loot == item) {
				var index = this.booty.indexOf(item);
				this.booty.splice(index,1);
				util.saveUser(this.id, this);
				return;
			}
		}
	}
}

module.exports = Pirate;
