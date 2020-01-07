/*
	ArrBot - util.js
		atr0phy
		created: 1/2/2020
		latest: 1/7/2020
		version: 1.2
*/



const Discord = require("discord.js");
const { Client, RichEmbed } = require('discord.js');
const fs = require('fs')



function time () {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return date+' '+time;
}

function log (logMsg) {
	try {
		var filePath = `bot.log`;
		var fullMsg = `${time()} : ${logMsg}`;

		console.log(fullMsg);
		// The absolute path of the new file with its name
		fs.access(filePath, fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				fs.writeFileSync(filePath, `${fullMsg}\n`, (err) =>{
					if (err) {
						console.log(err);
					}
				})
			} else {
				fs.appendFileSync(filePath, `${fullMsg}\n`, (err) => {
					if (err) {
						console.error(err);
					}
				});
			}
		});
	} catch (err) {
		console.log(err);
	}
}

function reply (msg, title, reply, avatar = null) {
	try {
	    if (avatar) {
		    var embed = new RichEmbed()
				// Set the avatar
				.setImage(avatar)
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0x40e0d0)
				//	 Set the main content of the embed
				.setDescription(reply);
		} else {
		    var embed = new RichEmbed()
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0x40e0d0)
				//	 Set the main content of the embed
				.setDescription(reply);		
		}
		// Send the embed to the same channel as the message
		msg.channel.send(embed);
	} catch (err) {
		log(err);
	}
}

function replyDM (msg, title, reply, avatar = null) {
	try {
	    if (avatar) {
		    var embed = new RichEmbed()
				// Set the avatar
				.setImage(avatar)
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0x40e0d0)
				//	 Set the main content of the embed
				.setDescription(reply);
		} else {
		    var embed = new RichEmbed()
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0x40e0d0)
				//	 Set the main content of the embed
				.setDescription(reply);		
		}
		// Send the embed to the same channel as the message
		msg.author.send(embed);
	} catch (err) {
		log(err);
	}
}

function getUser (username) {
	var data = fs.readFileSync(`users/${username}.json`, 'utf8', (err) => { if (err) log(err); });
	if (data) {
	    // log(data);
	    user = JSON.parse(data); //now it an object
	    return user;
	} else log("User not found.");
}

function saveUser (username, data) {
	var json = JSON.stringify(data);
	fs.writeFileSync(`users/${username}.json`, json, 'utf8', (err) => {
	    if (err){
	        log(err);
	    }
	});
}

function isUser (username) {
	try {
		if (fs.existsSync(`users/${username}.json`)) return true;
		else return false;
	} catch(err) {
		log(err)
	}
}


module.exports = {
    log: log,
    reply: reply,
    getUser: getUser,
    saveUser: saveUser,
    isUser: isUser,
    replyDM: replyDM
};