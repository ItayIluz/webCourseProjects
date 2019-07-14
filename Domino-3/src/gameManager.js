const gameManager = {};
const START_HAND_SIZE = 6;

function Game(title, numOfPlayers, createdBy){
    this.title = title;
    this.numOfPlayers = numOfPlayers;
    this.createdBy = createdBy;
    this.playersInGame = 0;
    this.status = "Pending";
    this.players = [];
    this.playerHands = [];
    this.numOfTurns = 0;
    this.deck = [];
    this.boardTiles = [];
    this.availablePositions = [];
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.numOfFinishedPlayers = 0;

    return this;
}


function Player(name){
    this.name = name;
    this.score = 0;
    this.isActive = true;

    return this;
}

gameManager.startGame = function(gameData){

    gameData.currentPlayerIndex = 0;
    gameData.isGameOver = false;
    gameData.numOfFinishedPlayers = 0;
    gameData.playerHands = [];
    gameData.numOfTurns = 0;
    gameData.boardTiles = [];
    gameData.availablePositions = [];

    gameData.deck = generateDeck();
    for(let i = 0; i < gameData.numOfPlayers; i++){
        gameData.playerHands.push(makeInitialDraw(gameData.deck));
    }

    return;
}

gameManager.drawFromDeck = function(playerIndex, gameData){
    if(gameData.deck.length > 0){
        gameData.playerHands[playerIndex].push(drawFromDeck(gameData.deck));
        nextPlayer(gameData);
    }
    return;
}

gameManager.placeTile = function(playerIndex, gameData, tile, tilePosition){
    tilePosition = tilePosition || {position: {x: 0, y: 0, spin: 0}};
    const playerHand = gameData.playerHands[playerIndex];
    const tileIndex = findTileIndex(playerHand, tile);

    if(shouldSpinTile(tile, tilePosition)){
        tilePosition.position.spin += 2;
    }

    if(tileIndex !== -1 && canPlaceTile(tile, tilePosition)){
        gameData.playerHands[playerIndex].splice(tileIndex, 1);
        addTileToBoard(gameData, tile, tilePosition);
        gameData.availablePositions = filterAdjacentPositions(gameData.availablePositions, tilePosition.position);
        addNewAvailablePositions(gameData, tile, tilePosition);
        addTileToScore(gameData, tile);
        nextPlayer(gameData);
    }

    return;
}

function generateDeck() {
    let newDeck = [];
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            newDeck.push({numA: i, numB: j});
        }
    }

    return newDeck;
}

function makeInitialDraw(deck) {
    let startHand = [];
    for(let i = 0; i < START_HAND_SIZE; i++){
        startHand.push(drawFromDeck(deck));
    }

    return startHand;
}

function drawFromDeck(deck) {
    let randTileIndex = Math.floor(Math.random() * deck.length);

    return deck.splice(randTileIndex, 1)[0];
}

function addTileToScore(gameData, tile){
    gameData.players[gameData.currentPlayerIndex].score += tile.numA + tile.numB;
}

function findTileIndex(tiles, tile){
    let index = -1;
    for(let i = 0; i < tiles.length; i++) {
        let currentTile = tiles[i];
        if(currentTile.numA === tile.numA && currentTile.numB === tile.numB){
            index = i;
        }
    }

    return index;
}

function nextPlayer(gameData){
    gameData.numOfTurns++;

    if(gameData.playerHands[gameData.currentPlayerIndex].length === 0){
        playerFinishedPlaying(gameData, gameData.currentPlayerIndex);
    }

    for(let i = 0; i < gameData.numOfPlayers; i++){
        gameData.currentPlayerIndex = (gameData.currentPlayerIndex + 1) % gameData.numOfPlayers;
        if(currentPlayerHasAvailableMoves(gameData)){
            return;
        }
    }
    endGame(gameData);
}

function canPlaceTile(tile, tilePosition){
    if(!tilePosition.requiredNum){
        return true;
    }
    if (!(tile.numA === tilePosition.requiredNum || tile.numB === tilePosition.requiredNum)) {
        return false;
    }

    if (tilePosition.doubleRequired && tile.numA !== tile.numB) {
        return false;
    }

    return true;
}

function addTileToBoard(gameData, tile, tilePosition){
    gameData.boardTiles.push({
            tile:tile,
            position: tilePosition.position
        });
}

function shouldSpinTile(tile, tilePosition) {
    return tile.numB === tilePosition.requiredNum;
}

function addNewAvailablePositions(gameData, tile, tilePosition) {
    let newAvailablePositions = getRegularAdjacent(tilePosition.position, tile.numA, tile.numB);

    if (tile.numA === tile.numB) {
        newAvailablePositions = newAvailablePositions.concat(getAdjacentOfDouble(tilePosition.position, tile.numA, tile.numB));
    } else {
        newAvailablePositions = newAvailablePositions.concat(getDoubleAdjacent(tilePosition.position, tile.numA, tile.numB));
    }

    if (!!tilePosition.fatherPosition) {
        newAvailablePositions = filterAdjacentPositions(newAvailablePositions, tilePosition.fatherPosition);
    }

    gameData.availablePositions = gameData.availablePositions.concat(newAvailablePositions);
}

function playerFinishedPlaying(gameData, playerIndex){
    gameData.players[playerIndex].isActive = false;

    let currentPosition = Math.max(...gameData.players.map(player => player.position ? player.position : 0)) || 0;
    currentPosition++;
    gameData.players[playerIndex].position = currentPosition;

    gameData.numOfFinishedPlayers += 1;

    if(gameData.numOfFinishedPlayers >= gameData.numOfPlayers - 1){
        endGame(gameData);
    }
}

function endGame(gameData) {
    let currentPosition = Math.max(...gameData.players.map(player => player.position ? player.position : 0)) || 0;
    
    gameData.players.forEach(player => {
        player.isActive = false;
        if(!player.position){
            player.position = ++currentPosition;
        }
    });
    gameData.isGameOver = true;
}

function currentPlayerHasAvailableMoves(gameData){
    if(gameData.deck.length !== 0) {
        return true;
    }
    if (gameData.playerHands[gameData.currentPlayerIndex]
        .some(tile => Object.values(gameData.availablePositions)
            .some(tilePosition => tile.numA === tilePosition.requiredNum || tile.numB === tilePosition.requiredNum))) {
        return true;
    }

    return false;
}

function getAdjacentOfDouble(position, numA, numB) {
    position.spin = position.spin % 4;
    return [1, -1].map(i => {
        if (isVertical(position)) {
            return {
                requiredNum: numA,
                doubleRequired: false,
                fatherPosition: position,
                position: {
                    x: position.x + i * 3,
                    y: position.y,
                    spin: (4 - i) % 4
                }
            }
        } else {
            return {
                requiredNum: numA,
                doubleRequired: false,
                fatherPosition: position,
                position: {
                    x: position.x,
                    y: position.y + i * 3,
                    spin: (1 - i)
                }
            }
        }
    })
}

function getDoubleAdjacent(position, numA, numB) {
    position.spin = position.spin % 4;
    return [1, -1].map(i => {
        if (isVertical(position)) {
            let num;
            if (position.spin === 0) {
                num = i === 1 ? numB : numA;
            } else {
                num = i === -1 ? numB : numA;
            }
            return {
                requiredNum: num,
                doubleRequired: true,
                fatherPosition: position,
                position: {
                    x: position.x,
                    y: position.y + i * 3,
                    spin: 1
                }
            }
        } else {
            let num;
            if (position.spin === 1) {
                num = i === 1 ? numA : numB;
            } else {
                num = i === -1 ? numA : numB;
            }
            return {
                requiredNum: num,
                doubleRequired: true,
                fatherPosition: position,
                position: {
                    x: position.x + i * 3,
                    y: position.y,
                    spin: 0
                }
            }
        }
    })
}

function getRegularAdjacent(position, numA, numB) {
    position.spin = position.spin % 4;
    return [1, -1].map(i => {
        if (isVertical(position)) {
            let num;
            if (position.spin === 0) {
                num = i === 1 ? numB : numA;
            } else {
                num = i === -1 ? numB : numA;
            }
            return {
                requiredNum: num,
                doubleRequired: false,
                fatherPosition: position,
                position: {
                    x: position.x,
                    y: position.y + i * 4,
                    spin: 1 - i
                }
            }
        } else {
            let num;
            if (position.spin === 1) {
                num = i === 1 ? numA : numB;
            } else {
                num = i === -1 ? numA : numB;
            }
            return {
                requiredNum: num,
                doubleRequired: false,
                fatherPosition: position,
                position: {
                    x: position.x + i * 4,
                    y: position.y,
                    spin: 2 + i
                }
            }
        }
    })
}

function isVertical(position) {
    return position.spin % 2 === 0;
}

function filterAdjacentPositions(tilePositions, takenPosition) {
    tilePositions = tilePositions.filter(tilePosition => {
        if (takenPosition.x === tilePosition.position.x && Math.abs(takenPosition.y - tilePosition.position.y) <= 1) {
            return false;
        }
        if (takenPosition.y === tilePosition.position.y && Math.abs(takenPosition.x - tilePosition.position.x) <= 1) {
            return false;
        }
        return true;
    });

    return tilePositions;
}

module.exports = {gameManager, Game, Player};