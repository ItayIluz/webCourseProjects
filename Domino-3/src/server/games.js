const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./auth');

const gameData = [];

const gamesManagement = express.Router();

gamesManagement.use(bodyParser.text());

gamesManagement.route('/')
	.get(auth.userAuthentication, (req, res) => {		
		res.json(gameData);
	})
	.post(auth.userAuthentication, (req, res) => {		
		const requestData = JSON.parse(req.body);
        const userInfo =  auth.getUserInfo(req.session.id);
        gameData.push({
			title: requestData.title,
			numOfPlayers: requestData.numOfPlayers,
			createdBy: userInfo.name, 
			playersInGame: 0,
			status: "Pending"
		});        
        res.sendStatus(200);
	});

gamesManagement.post('/deleteGame', auth.userAuthentication, (req, res) => {	
	const searchTitle = req.body;
	const index = gameData.findIndex(a => a.title === searchTitle);
	if (index > -1)
		gameData.splice(index, 1);

	res.sendStatus(200);
});

module.exports = gamesManagement;