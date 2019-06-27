const gameManager = {};
const START_HAND_SIZE = 6;

gameManager.startGame = function(gameData){
    gameData.deck = generateDeck();
    for(let i = 0; i < gameData.numOfPlayers; i++){
        gameData.playerHands.push(makeInitialDraw(gameData.deck));
    }

    return;
}

gameManager.drawFromDeck = function(playerIndex, gameData){
    gameData.playerHands[playerIndex].push(drawFromDeck(gameData.deck));
    nextPlayer(gameData);
}

gameManager.getFirstHand = function(playerIndex, gameData){
    return [{"numA":1,"numB":0},{"numA":3,"numB":2},{"numA":6,"numB":2},{"numA":1,"numB":1},{"numA":6,"numB":5},{"numA":3,"numB":3}];
}

gameManager.getBoardTiles = function(gameData){
    return [{tile:{"numA":1,"numB":0}, position:{"x":5,"y":4,"spin":0}} ,{tile:{"numA":3,"numB":2}, position:{"x":5,"y":0,"spin":1}},{tile:{"numA":6,"numB":2}, position:{"x":5,"y":8,"spin":0}}];
}

gameManager.placeTile = function(playerIndex, gameData, tile, tilePosition){
    const playerHand = gameData.playerHands[playerIndex];
    const tileIndex = findTileIndex(playerHand, tile);

    if(tileIndex !== -1 && canPlaceTile(tile, tilePosition)){
        gameData.playerHands[playerIndex].splice(tileIndex, 1);
        addTileToBoard(gameData, tile, tilePosition);
        nextPlayer(gameData);
        addNewAvailablePositions(gameData, tile, tilePosition);
    }

    return;
}

gameManager.getAvailablePositions = function(gameData){
    return [{"requiredNum":5,"doubleRequired":false,"position":{"x":0,"y":4,"spin":0}},{"requiredNum":6,"doubleRequired":false,"position":{"x":0,"y":-4,"spin":2}},{"requiredNum":5,"doubleRequired":true,"position":{"x":0,"y":3,"spin":1}},{"requiredNum":6,"doubleRequired":true,"position":{"x":0,"y":-3,"spin":1}}];
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
    gameData.currentPlayerIndex = (gameData.currentPlayerIndex + 1) % gameData.numOfPlayers;
    // todo
}

function canPlaceTile(tile, tilePosition){
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

    addNewAvailablePositions(gameData, tile, tilePosition)
}

function addNewAvailablePositions(gameData, tile, tilePosition) {
    let newAvailablePositions = getRegularAdjacent(position, tile.numA, tile.numB);

    if (tile.numA === tile.numB) {
        newAvailablePositions = newAvailablePositions.concat(getAdjacentOfDouble(position, numA, numB));
    } else {
        newAvailablePositions = newAvailablePositions.concat(getDoubleAdjacent(position, numA, numB));
    }

    if (!!tilePosition.fatherPosition) {
        newAvailablePositions = filterPositions(newAvailablePositions, tilePosition.fatherPosition);
    }

    gameData.availablePositions = gameData.availablePositions.concat(newAvailablePositions);
}

function getAdjacentOfDouble(position, numA, numB) {
    position.spin = position.spin % 4;
    return [1, -1].map(i => {
        if (isVertical(position)) {
            return {
                requiredNum: numA,
                doubleRequired: false,
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

function filterPositions(tilePositions, takenPosition) {
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

module.exports = gameManager;