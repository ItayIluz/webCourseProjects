const BOARD_DIMENSION = 10;
let timeCounter;
let gameData = {
    board: [],
    player1sTurn: true,
    player1Score: 2,
    player2Score: 2,
    player1TwoPiecesCount: 1,
    player2TwoPiecesCount: 1,
    player1Wins: 0,
    player2Wins: 0,
    totalTurns: 0,
    gameTime: 0,
    turnTime: 0,
    averageTurnTime: 0,
};
let statisticsElements;

function updateGameTime() {
    gameData.gameTime++;
    statisticsElements.gameTimeSpan.innerHTML = formatTime(gameData.gameTime);
}

function updateStatistics() { // TODO Add current player's turn
    statisticsElements.totalTurnsSpan.innerHTML = gameData.totalTurns;
    statisticsElements.averageTurnTimeSpan.innerHTML = formatTime(gameData.averageTurnTime);
    statisticsElements.player1ScoreSpan.innerHTML = gameData.player1Score;
    statisticsElements.player2ScoreSpan.innerHTML = gameData.player2Score;
    statisticsElements.player1TwoPiecesCountSpan.innerHTML = gameData.player1TwoPiecesCount;
    statisticsElements.player2TwoPiecesCountSpan.innerHTML = gameData.player2TwoPiecesCount;
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

function buildBoardAndInitGame() {

    let divRow, divCell, divPiece,
        halfBoardDimension = (BOARD_DIMENSION / 2) - 1,
        reverseHalfBoardDimension = BOARD_DIMENSION - 1 - halfBoardDimension,
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

            if ((row === halfBoardDimension && column === halfBoardDimension) || (row === reverseHalfBoardDimension && column === reverseHalfBoardDimension)) {
                divCell.className += " white";
                gameData.board[row][column] = {element: divCell, isPlayer1: true, possiblePieces: []}; // player1 - white
            } else if ((row === reverseHalfBoardDimension && column === halfBoardDimension) || (row === halfBoardDimension && column === reverseHalfBoardDimension)) {
                divCell.className += " black";
                gameData.board[row][column] = {element: divCell, isPlayer1: false, possiblePieces: []}; // player2 - black
            } else {
                gameData.board[row][column] = {element: divCell, isPlayer1: null, possiblePieces: []};
                divCell.dataset.score = "";

                divCell.onclick = function(){
                    let cellData = gameData.board[row][column];
                    
                    if (cellData.possiblePieces.length > 0) {
                        this.classList.remove("show-score");
                        changePlayerPieces(cellData.possiblePieces);
                        updateGameData(parseInt(this.dataset.score))
                        updateStatistics();
                        checkEndgame();
                    }
                };

                divCell.onmouseover = function(){
                    let result = checkForPossibleMoves(row, column);
                    gameData.board[row][column].possiblePieces = result.finalPossiblePieces;
                    if(result.possibleScore !== 0){
                        this.classList.add("can-place");
                        this.classList.add("show-score");
                        this.dataset.score = result.possibleScore;
                    }                                     
                };

                divCell.onmouseout = function(){
                    gameData.board[row][column].possiblePieces = [];
                    this.classList.remove("can-place");
                    this.classList.remove("show-score");
                    this.dataset.score = "";     
                };
            }

            divCell.append(divPiece);
        }

        gameBoard.append(divRow);
    }

    // Get easy access to statistics elements
    statisticsElements = {
        gameTimeSpan: document.getElementById("statistics-game-time"),
        totalTurnsSpan: document.getElementById("statistics-total-turns"),
        averageTurnTimeSpan: document.getElementById("statistics-average-turn-time"),
        player1ScoreSpan: document.getElementById("statistics-player1-score"),
        player2ScoreSpan: document.getElementById("statistics-player2-score"),
        player1TwoPiecesCountSpan: document.getElementById("statistics-player1-two-pieces-count"),
        player2TwoPiecesCountSpan: document.getElementById("statistics-player2-two-pieces-count")
    };

    updateStatistics();
    timeCounter = setInterval(updateGameTime, 1000);
}

function areThereMovesLeft() {
    for (let row = 0; row < BOARD_DIMENSION; row++) {
        for (let column = 0; column < BOARD_DIMENSION; column++) {
            if(checkForPossibleMoves(row, column).possibleScore !== 0)
                return true;
        }
    }
    return false;
}

function checkEndgame() {
    
    if (!areThereMovesLeft() || gameData.player1Score === 0 || gameData.player2Score === 0 || (gameData.player1Score + gameData.player2Score === BOARD_DIMENSION * BOARD_DIMENSION)) {
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
    }
}

function updateGameData(scoreChange) {
    if (gameData.player1sTurn) { // Update score
        gameData.player1Score += scoreChange;
        gameData.player2Score -= (scoreChange - 1);
    } else {
        gameData.player2Score += scoreChange;
        gameData.player1Score -= (scoreChange - 1);
    }

    if (gameData.player1Score === 2)
        gameData.player1TwoPiecesCount++;

    if (gameData.player2Score === 2)
        gameData.player2TwoPiecesCount++

    gameData.player1sTurn = !gameData.player1sTurn; // Change turn
    gameData.totalTurns++; // Increment total turns
    gameData.averageTurnTime = gameData.gameTime / gameData.totalTurns; // Calculate average turn time
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
            cellData.isPlayer1 = gameData.player1sTurn;
        }
    }
}

// Check board boundaries
function isValidPosition(row, column) {
    return (row >= 0 && row < BOARD_DIMENSION) && (column >= 0 && column < BOARD_DIMENSION);
}

function checkForPossibleMoves(clickedRow, clickedColumn) {

    let rowCheck, columnCheck, result = {possibleScore: 0, finalPossiblePieces: []};

    if (!isValidPosition(clickedRow, clickedColumn) || gameData.board[clickedRow][clickedColumn].isPlayer1 !== null)
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
            while (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 !== null && gameData.board[rowCheck][columnCheck].isPlayer1 === !gameData.player1sTurn) {

                possiblePieces.push([rowCheck, columnCheck]);

                // Move to next position
                rowCheck += rowDirection;
                columnCheck += columnDirection;

            }

            if (possiblePieces.length !== 0) { // Found possible pieces to change
                // Check that the next piece is of the current player's color
                if (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 !== null && gameData.board[rowCheck][columnCheck].isPlayer1 === gameData.player1sTurn) {
                    // Move is valid, add all possible pieces the final result
                    for (let piece in possiblePieces)
                        result.finalPossiblePieces.push(possiblePieces[piece]);
                }
            }
        }
    }
    
    if(result.finalPossiblePieces.length > 0) {
        result.finalPossiblePieces.push([clickedRow, clickedColumn]); // Add the piece in the clicked location
        for (let i = 0; i < result.finalPossiblePieces.length; i++) {
            if (gameData.board[result.finalPossiblePieces[i][0]][result.finalPossiblePieces[i][1]].isPlayer1 !== gameData.player1sTurn)
                result.possibleScore++;
        }
    }

    return result;
}