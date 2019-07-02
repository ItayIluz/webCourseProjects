const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./auth');
const gameManager = require('../gameManager');

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
gamesManagement.use(auth.userAuthentication);

gamesManagement.route('/')
	.get((req, res) => {		
		res.json(gamesData);
	})
	.post((req, res) => {
		//todo game with same title!
		const requestData = JSON.parse(req.body);
        const userInfo = auth.getUserInfo(req.session.id);
        gamesData.push({
			title: requestData.title,
			numOfPlayers: requestData.numOfPlayers,
			createdBy: userInfo.name, 
			playersInGame: 0,
			status: "Pending",
			players: [],
			playerHands: [],
			playerScores: [],
			deck: [],
			boardTiles: [],
			availablePositions: [],
			currentPlayerIndex: 0
		});        
        res.sendStatus(200);
	});

gamesManagement.get('/gameData/:searchTitle', (req, res) => {	
	const gameData = gamesData.find(a => a.title === req.params.searchTitle);
	const playerIndex = gameData.players.findIndex(a => req.playerName === a);
	gameData.isMyTurn = playerIndex === gameData.currentPlayerIndex;
	gameData.currentPlayerName = gameData.players[gameData.currentPlayerIndex];
	gameData.hand = gameData.playerHands[gameData.currentPlayerIndex];
	if (gameData)
		res.json(gameData);
});

gamesManagement.post('/deleteGame', (req, res) => {	
	const searchTitle = req.body;
	const index = gamesData.findIndex(a => a.title === searchTitle);
	if (index > -1)
		gamesData.splice(index, 1);

	res.sendStatus(200);
});

gamesManagement.post('/playerJoinGame', (req, res) => {	
	const searchTitle = req.body;
	const playerName = auth.getUserInfo(req.session.id).name;
	const index = gamesData.findIndex(a => a.title === searchTitle);
	if (index > -1){
		gamesData[index].players.push(playerName);
		gamesData[index].playersInGame++;

		if(gamesData[index].numOfPlayers === gamesData[index].playersInGame){
			gamesData[index].status = "In Session";
			gameManager.startGame(gamesData[index]);
		}
	}

	res.sendStatus(200);
});


//Game Management


gamesManagement.post('/makeMove/draw', (req, res) => {
	const playerIndex = gameData.players.findIndex(req.playerName);
	const gameData = gamesData[gamesData.findIndex(a => a.title === searchTitle)];

	gameManager.drawFromDeck(playerIndex, gameData);

	res.send(200);
})

gamesManagement.post('/makeMove/placeTile', (req, res) => {	
	const playerIndex = gameData.players.findIndex(req.playerName);
	const gameData = gamesData[gamesData.findIndex(a => a.title === searchTitle)];

	gameManager.placeTile(playerIndex, gameData, req.body.tile, req.body.position);

	res.send(200);
})

module.exports = gamesManagement;