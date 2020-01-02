/*
PirateBot - mongo.js
	by Luna Catastrophe
	Created: 12/21/2019
	Latest: 12/30/2019
	Version: 1.2.2
*/


const MongoClient = require('mongodb').MongoClient;
const readlineSync = require('readline-sync');

function dbConnect () {	
	const password = encodeURI(readlineSync.question('MongoDB password:',{hideEchoBack: true}));
	const uri = `mongodb+srv://PirateBot:${password}@piratebot-2t50o.mongodb.net/test?retryWrites=true&w=majority`;

	return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

}

function isPirate (dbClient, id) {
	dbClient.connect(err => {
		const pirates = dbClient.db("PirateBot").collection("Pirates");

		var pirate = pirates.findOne({"id": id}, function(err, result) {
			if (err) throw err;
			// console.log(result);
			if (result) {
				return true;
			} else {
				console.log(`pirate ${id} not found`)
				return false;
			}
		});

		// dbClient.close();
	});
}

function insertPirate (dbClient, pirate) {
	dbClient.connect(err => {
		const pirates = dbClient.db("PirateBot").collection("Pirates");

		return pirates.insertOne(pirate, function(err, result) {
			if (err) throw err;
			// console.log(result);
		});

		// dbClient.close();
	});
}

function updatePirate (dbClient, id) {
	dbClient.connect(err => {
		const pirates = dbClient.db("PirateBot").collection("Pirates");

		return pirates.updateOne({"id": id}, function(err, result) {
			if (err) throw err;
			// console.log(result);
		});

		// dbClient.close();
	});
}

function getPirate (dbClient, id) {
	dbClient.connect(err => {
		const pirates = dbClient.db("PirateBot").collection("Pirates");

		return pirates.findOne({"id": id}, function(err, result) {
			if (err) throw err;
			// console.log(result);
		});

		// dbClient.close();
	});
}

exports.dbConnect = dbConnect;
exports.isPirate = isPirate;
exports.getPirate = getPirate;
exports.insertPirate = insertPirate;
exports.updatePirate = updatePirate;



