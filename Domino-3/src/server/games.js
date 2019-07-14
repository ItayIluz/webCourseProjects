const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./auth');
const {gameManager, Game, Player} = require('../gameManager');

const gamesData = [];
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
		new Game(requestData.title, requestData.numOfPlayers, userInfo.name)
        gamesData.push(new Game(requestData.title, requestData.numOfPlayers, userInfo.name));        
        res.sendStatus(200);
	});

gamesManagement.get('/gameData/:searchTitle', (req, res) => {	
	const gameData = gamesData.find(a => a.title === req.params.searchTitle);
	const playerIndex = gameData.players.findIndex(player => req.playerName === player.name);
	gameData.isMyTurn = playerIndex === gameData.currentPlayerIndex;
	gameData.currentPlayerName = gameData.players[gameData.currentPlayerIndex].name;
	gameData.hand = gameData.playerHands[playerIndex];
	gameData.score = gameData.players[playerIndex] ? gameData.players[playerIndex].score : 0;
	if (gameData)
		res.json(gameData);
});

gamesManagement.post('/deleteGame', (req, res) => {	
	const searchTitle = req.body.gameTitle;
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
		gamesData[index].players.push(new Player(playerName));
		gamesData[index].playersInGame++;

		if(gamesData[index].numOfPlayers === gamesData[index].playersInGame){
			gamesData[index].status = "In Session";
			gameManager.startGame(gamesData[index]);
		}
	}

	res.sendStatus(200);
});

gamesManagement.post('/playerLeaveGame', (req, res) => {	
	const searchTitle = req.body;
	const playerName = auth.getUserInfo(req.session.id).name;
	const gameIndex = gamesData.findIndex(a => a.title === searchTitle);
	if (gameIndex > -1){
		const playerIndex = gamesData[gameIndex].players.findIndex(a => a.name === playerName);
		if(playerIndex > -1){
			gamesData[gameIndex].players.splice(playerIndex,1);
			gamesData[gameIndex].playersInGame--;

			if(gamesData[gameIndex].status === "In Session" && gamesData[gameIndex].isGameOver && gamesData[gameIndex].playersInGame === 0){
				gamesData[gameIndex].isGameOver = false;
				gamesData[gameIndex].status = "Pending";
			}
		}
	}

	res.sendStatus(200);
});


//Game Management


gamesManagement.post('/makeMove/draw', (req, res) => {
	const body = JSON.parse(req.body);
	const gameData = gamesData[gamesData.findIndex(a => a.title === body.gameTitle)];
	const playerIndex = gameData.players.findIndex(player => req.playerName === player.name);

	gameManager.drawFromDeck(playerIndex, gameData);

	res.send(200);
})

gamesManagement.post('/makeMove/placeTile', (req, res) => {	
	const body = JSON.parse(req.body);
	const gameData = gamesData[gamesData.findIndex(a => a.title === body.gameTitle)];
	const playerIndex = gameData.players.findIndex(player => req.playerName === player.name);

	gameManager.placeTile(playerIndex, gameData, body.tile, body.position);

	res.send(200);
})

module.exports = gamesManagement;