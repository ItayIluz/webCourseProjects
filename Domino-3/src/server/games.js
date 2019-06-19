const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./auth');

const gamesData = [];
/*
 * Each game has the following properties:
 	title: The title of the game
	numOfPlayers: The number of players needed for the game
	createdBy: The name of the user who created the game
	playersInGame: The total number of players who joined the game
	status: The status of the game - Pending/In Session
	players: An array with the names of the players who joined the game
*/

const gamesManagement = express.Router();

gamesManagement.use(bodyParser.text());

gamesManagement.route('/')
	.get(auth.userAuthentication, (req, res) => {		
		res.json(gamesData);
	})
	.post(auth.userAuthentication, (req, res) => {		
		const requestData = JSON.parse(req.body);
        const userInfo = auth.getUserInfo(req.session.id);
        gamesData.push({
			title: requestData.title,
			numOfPlayers: requestData.numOfPlayers,
			createdBy: userInfo.name, 
			playersInGame: 0,
			status: "Pending",
			players: [],
		});        
        res.sendStatus(200);
	});

gamesManagement.get('/gameData/:searchTitle', auth.userAuthentication, (req, res) => {	
	const index = gamesData.findIndex(a => a.title === req.params.searchTitle);
	if (index > -1)
		res.json(gamesData[index]);
});

gamesManagement.post('/deleteGame', auth.userAuthentication, (req, res) => {	
	const searchTitle = req.body;
	const index = gamesData.findIndex(a => a.title === searchTitle);
	if (index > -1)
		gamesData.splice(index, 1);

	res.sendStatus(200);
});

gamesManagement.post('/playerJoinGame', auth.userAuthentication, (req, res) => {	
	const searchTitle = req.body;
	const playerName = auth.getUserInfo(req.session.id).name;
	const index = gamesData.findIndex(a => a.title === searchTitle);
	if (index > -1){
		gamesData[index].players.push(playerName);
		gamesData[index].playersInGame++;

		if(gamesData[index].numOfPlayers == gamesData[index].playersInGame)
			gamesData[index].status = "In Session";
	}

	res.sendStatus(200);
});

module.exports = gamesManagement;