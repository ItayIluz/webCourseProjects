const BOARD_DIMENSION = 10;
let timeCounter;
let gameData = {
    board: [],
    player1sTurn: true,
    player1Score: 2,
    player2Score: 2,
    player1TwoPiecesCount: 1,
    player2TwoPiecesCount: 1,
    player1CurrentGameTurnCount: 0,
    player2CurrentGameTurnCount: 0,
    player1AllGamesTurnCount: 0,
    player2AllGamesTurnCount: 0,
    player1AverageTurnTime: 0,
    player1AverageTurnTimeAllGames: 0,
    player2AverageTurnTime: 0,
    player2AverageTurnTimeAllGames: 0,
    player1Wins: 0,
    player2Wins: 0,
    currentGameTotalTurns: 0,
    currentGameTime: 0,
    AllGamesTime: 0,
    gameRunning: true
};
let gameElements;

function updateGameTime() {
    gameData.currentGameTime++;
    gameData.AllGamesTime++;
    gameElements.gameTimeSpan.innerHTML = formatTime(gameData.currentGameTime);
}

function updateStatistics() { // TODO Add current player's turn
    gameElements.totalTurnsSpan.innerHTML = gameData.currentGameTotalTurns;
    gameElements.player1AverageTurnTimeSpan.innerHTML = formatTime(gameData.player1AverageTurnTime);
    gameElements.player2AverageTurnTimeSpan.innerHTML = formatTime(gameData.player2AverageTurnTime);
    gameElements.player1AverageTurnTimeAllGamesSpan.innerHTML = formatTime(gameData.player1AverageTurnTimeAllGames);
    gameElements.player2AverageTurnTimeAllGamesSpan.innerHTML = formatTime(gameData.player2AverageTurnTimeAllGames);
    gameElements.player1ScoreSpan.innerHTML = gameData.player1Score;
    gameElements.player2ScoreSpan.innerHTML = gameData.player2Score;
    gameElements.player1TwoPiecesCountSpan.innerHTML = gameData.player1TwoPiecesCount;
    gameElements.player2TwoPiecesCountSpan.innerHTML = gameData.player2TwoPiecesCount;
}

function formatTime(time) {
    let minutes = parseInt(time / 60);
    let seconds = parseInt(time - (minutes * 60));

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return minutes + ":" + seconds;
}

function initializeGame() {

    let halfBoardDimension = (BOARD_DIMENSION / 2) - 1,
        reverseHalfBoardDimension = BOARD_DIMENSION - 1 - halfBoardDimension;

    gameData.player1sTurn = true;
    gameData.player1Score = 2;
    gameData.player2Score = 2;
    gameData.player1TwoPiecesCount = 1;
    gameData.player2TwoPiecesCount = 1;
    gameData.currentGameTotalTurns = 0;
    gameData.currentGameTime = 0;
    gameData.player1CurrentGameTurnCount = 0;
    gameData.player2CurrentGameTurnCount = 0;
    gameData.player1AverageTurnTime = 0;
    gameData.player2AverageTurnTime = 0;
    gameData.gameRunning = true;

    for (let row = 0; row < BOARD_DIMENSION; row++) {

        for (let column = 0; column < BOARD_DIMENSION; column++) {

            let boardCell = gameData.board[row][column];

            if ((row === halfBoardDimension && column === halfBoardDimension) || (row === reverseHalfBoardDimension && column === reverseHalfBoardDimension)) {
                boardCell.element.className = "board-cell white"; // player1 - white
                boardCell.element.onclick = undefined;
                boardCell.element.onmouseover = undefined;
                boardCell.element.onmouseout = undefined;
                boardCell.isPlayer1 = true;
                boardCell.possiblePieces = [];
            } else if ((row === reverseHalfBoardDimension && column === halfBoardDimension) || (row === halfBoardDimension && column === reverseHalfBoardDimension)) {
                boardCell.element.className = "board-cell black"; // player1 - black
                boardCell.element.onclick = undefined;
                boardCell.element.onmouseover = undefined;
                boardCell.element.onmouseout = undefined;
                boardCell.isPlayer1 = false;
                boardCell.possiblePieces = [];
            } else {
                boardCell.element.className = "board-cell";
                boardCell.isPlayer1 = null;
                boardCell.possiblePieces = [];
                boardCell.element.dataset.score = "";

                boardCell.element.onclick = function () {
                    if(gameData.gameRunning){
                        let cellData = gameData.board[row][column];
                        
                        if (cellData.possiblePieces.length > 0) {
                            this.classList.remove("can-place");
                            changePlayerPieces(cellData.possiblePieces);
                            updateGameData(parseInt(this.dataset.score))
                            updateStatistics();
                            checkEndgame();
                        }
                    }
                };

                boardCell.element.onmouseover = function () {
                    if(gameData.gameRunning){
                        let result = checkForPossibleMoves(row, column);
                        gameData.board[row][column].possiblePieces = result.finalPossiblePieces;
                        if (result.possibleScore !== 0) {
                            this.classList.add("can-place");
                            this.dataset.score = result.possibleScore;
                        }
                    }
                };

                boardCell.element.onmouseout = function () {
                    if(gameData.gameRunning){
                        gameData.board[row][column].possiblePieces = [];
                        this.classList.remove("can-place");
                        this.dataset.score = "";
                    }
                };
            }
        }
    }

    gameElements.restartGameButton.hidden = true;
    gameElements.currentPlayersTurnSpan.innerHTML = "Player 1 (White)";
    updateStatistics();
    timeCounter = setInterval(updateGameTime, 1000);
}

function buildBoardAndInitGame() {

    let divRow, divCell, divPiece,
        gameBoard = document.getElementById("reversi-board");

    for (let row = 0; row < BOARD_DIMENSION; row++) {

        gameData.board[row] = [];
        divRow = document.createElement("div");
        divRow.className = "board-row";

        for (let column = 0; column < BOARD_DIMENSION; column++) {
            divCell = document.createElement("div");
            divCell.className = "board-cell";
            divRow.append(divCell);

            divPiece = document.createElement("div");
            divPiece.className = "board-piece";

            gameData.board[row][column] = {element: divCell};
            divCell.append(divPiece);
        }

        gameBoard.append(divRow);
    }

    // Get easy access to game HTML elements
    gameElements = {
        gameTimeSpan: document.getElementById("statistics-game-time"),
        totalTurnsSpan: document.getElementById("statistics-total-turns"),
        player1AverageTurnTimeSpan: document.getElementById("statistics-player1-average-turn-time"),
        player2AverageTurnTimeSpan: document.getElementById("statistics-player2-average-turn-time"),
        player1AverageTurnTimeAllGamesSpan: document.getElementById("statistics-player1-average-turn-time-all-games"),
        player2AverageTurnTimeAllGamesSpan: document.getElementById("statistics-player2-average-turn-time-all-games"),
        player1ScoreSpan: document.getElementById("statistics-player1-score"),
        player2ScoreSpan: document.getElementById("statistics-player2-score"),
        player1TwoPiecesCountSpan: document.getElementById("statistics-player1-two-pieces-count"),
        player2TwoPiecesCountSpan: document.getElementById("statistics-player2-two-pieces-count"),
        currentPlayersTurnSpan: document.getElementById("current-players-turn"),
        restartGameButton: document.getElementById("restart-game-button"),
    };

    initializeGame();
}

function areThereMovesLeft() {
    for (let row = 0; row < BOARD_DIMENSION; row++) {
        for (let column = 0; column < BOARD_DIMENSION; column++) {
            if (checkForPossibleMoves(row, column).possibleScore !== 0)
                return true;
        }
    }
    return false;
}

function checkEndgame() {

    if (gameData.player1Score === 0 || gameData.player2Score === 0 || (gameData.player1Score + gameData.player2Score === BOARD_DIMENSION * BOARD_DIMENSION)) {
        if (gameData.player1Score > gameData.player2Score) { // Player 1 wins
            gameData.player1Wins++;
            alert("Game Over - Player 1 is the winner!"); // Update message
        } else if (gameData.player2Score > gameData.player1Score) { // Player 2 wins
            gameData.player2Wins++;
            alert("Game Over - Player 2 is the winner!"); // Update message
        } else { // It's a tie
            alert("Game Over - It's a tie!"); // Update message
        }
        clearInterval(timeCounter);
        gameElements.restartGameButton.hidden = false;
        gameData.gameRunning = false;
    }
}

function updateGameData(scoreChange) {
    if (gameData.player1sTurn) { // Update score
        gameData.player1Score += scoreChange;
        gameData.player2Score -= (scoreChange - 1);
        gameData.player1CurrentGameTurnCount++;
        gameData.player1AllGamesTurnCount++;
        gameData.player1AverageTurnTime = gameData.currentGameTime / gameData.player1CurrentGameTurnCount; // Calculate average turn time
        gameData.player1AverageTurnTimeAllGames = gameData.AllGamesTime / gameData.player1AllGamesTurnCount; // Calculate average turn time for all games
    } else {
        gameData.player2Score += scoreChange;
        gameData.player1Score -= (scoreChange - 1);
        gameData.player2CurrentGameTurnCount++;
        gameData.player2AllGamesTurnCount++;
        gameData.player2AverageTurnTime = gameData.currentGameTime / gameData.player2CurrentGameTurnCount; // Calculate average turn time
        gameData.player2AverageTurnTimeAllGames = gameData.AllGamesTime / gameData.player2AllGamesTurnCount; // Calculate average turn time for all games
    }

    if (gameData.player1Score === 2)
        gameData.player1TwoPiecesCount++;

    if (gameData.player2Score === 2)
        gameData.player2TwoPiecesCount++

    gameData.player1sTurn = !gameData.player1sTurn; // Change turn
    gameData.currentGameTotalTurns++; // Increment total turns
    
    gameElements.currentPlayersTurnSpan.innerHTML = (gameData.player1sTurn ? "Player 1 (White)" : "Player 2 (Black)");
}

function changePlayerPieces(piecesToChange) {
    // Change pieces
    for (let i = 0; i < piecesToChange.length; i++) {
        if (gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].isPlayer1 !== gameData.player1sTurn) {
            let cellData = gameData.board[piecesToChange[i][0]][piecesToChange[i][1]];
            cellData.element.classList.remove(gameData.player1sTurn ? "black" : "white");
            cellData.element.classList.add(gameData.player1sTurn ? "white" : "black");
            cellData.element.classList.add(gameData.player1sTurn ? "white" : "black");
            cellData.element.onclick = undefined;
            cellData.element.onmouseover = undefined;
            cellData.element.onmouseout = undefined;
            cellData.isPlayer1 = gameData.player1sTurn;
        }
    }
}

// Check board boundaries
function isInBounds(row, column) {
    return (row >= 0 && row < BOARD_DIMENSION) && (column >= 0 && column < BOARD_DIMENSION);
}

function checkForPossibleMoves(clickedRow, clickedColumn) {

    let rowCheck, columnCheck, isValid = false, result = {possibleScore: 0, finalPossiblePieces: []};

    if (!isInBounds(clickedRow, clickedColumn) || gameData.board[clickedRow][clickedColumn].isPlayer1 !== null)
        return result;

    // Check all eight directions
    for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {

        for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {

            if (rowDirection === 0 && columnDirection === 0)  // Skip the clicked position
                continue;

            // Move to next piece
            rowCheck = clickedRow + rowDirection;
            columnCheck = clickedColumn + columnDirection;

            let possiblePieces = [];

            // Look for valid pieces and pieces with opposite color
            while(isInBounds(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 !== null && gameData.board[rowCheck][columnCheck].isPlayer1 !== gameData.player1sTurn) {

                possiblePieces.push([rowCheck, columnCheck]);

                // Move to next position
                rowCheck += rowDirection;
                columnCheck += columnDirection;
            }

            // Check that the next piece is of the current player's color
            if (isInBounds(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 !== null && gameData.board[rowCheck][columnCheck].isPlayer1 === gameData.player1sTurn) {
                // Move is valid, add all possible pieces the final result
                isValid = true;
                for (let piece in possiblePieces)
                    result.finalPossiblePieces.push(possiblePieces[piece]);
            }
            
        }
    }

    if(isValid)
        result.finalPossiblePieces.push([clickedRow, clickedColumn]); // Add the piece in the clicked location

    if (result.finalPossiblePieces.length > 0) {
        for (let i = 0; i < result.finalPossiblePieces.length; i++) {
            if (gameData.board[result.finalPossiblePieces[i][0]][result.finalPossiblePieces[i][1]].isPlayer1 !== gameData.player1sTurn)
                result.possibleScore++;
        }
    }
    
    return result;
}

function playerQuitGame() {

    if (gameData.player1sTurn) {
        gameData.player2Wins++;
        alert("Player 1 quit - Player 2 is the winner!"); // Update message
    } else {
        gameData.player1Wins++;
        alert("Player 2 quit - Player 1 is the winner!"); // Update message
    }
    clearInterval(timeCounter);
    gameElements.restartGameButton.hidden = false;
    gameData.gameRunning = false;
}

function toggleShowScore(event) {
    if (event.target.checked) {
        document.getElementById('reversi-game').classList.add('assist-score');
    } else {
        document.getElementById('reversi-game').classList.remove('assist-score');
    }
}