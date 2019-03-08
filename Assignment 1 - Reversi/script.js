
const BOARD_DIMENSION = 8;
let gameData = {
    board: [],
    player1sTurn: true,
    totalTurns: 0,
    player1Score: 2,
    player2Score: 2,
};

function buildBoard(){

    let divRow, divCell, divPiece,
        halfBoardDimension = (BOARD_DIMENSION / 2) - 1,
        reverseHalfBoardDimension = BOARD_DIMENSION - 1 - halfBoardDimension,
        gameBoard = document.getElementById("reversi-board");

    for(let row = 0; row < BOARD_DIMENSION; row++){
        
        gameData.board[row] = [];
        divRow = document.createElement("div");
        divRow.className = "board-row";

        for(let column = 0; column < BOARD_DIMENSION; column++){
            divCell = document.createElement("div");
            divCell.className = "board-cell";
            divRow.append(divCell);

            divPiece = document.createElement("div");
            divPiece.className = "board-piece";

            if((row == halfBoardDimension && column == halfBoardDimension) || (row == reverseHalfBoardDimension && column == reverseHalfBoardDimension)){
                divPiece.className += " white";
                gameData.board[row][column] = { element: divPiece, isPlayer1: true }; // player1 - white
            } else if((row == reverseHalfBoardDimension && column == halfBoardDimension) || (row == halfBoardDimension && column == reverseHalfBoardDimension)){
                divPiece.className += " black";
                gameData.board[row][column] = { element: divPiece, isPlayer1: false}; // player2 - black
            } else {
                gameData.board[row][column] = { element: divPiece, isPlayer1: null};
                divPiece.onclick = () => {
                    if(isValidMove(row, column, gameData.player1sTurn)){
                        let scoreChange = changePlayerPieces(row, column, gameData.player1sTurn);
                        
                        if(gameData.player1sTurn){ // Update score
                            gameData.player1Score += scoreChange;
                            gameData.player2Score -= (scoreChange-1);
                        } else {
                            gameData.player2Score += scoreChange;
                            gameData.player1Score -= (scoreChange-1);
                        }

                        gameData.player1sTurn = !gameData.player1sTurn; // Change turn
                        gameData.totalTurns++; // Increment total turns

                        console.log("Total Turns: " + gameData.totalTurns);
                        console.log("Player 1 Score: " + gameData.player1Score);
                        console.log("Player 2 Score: " + gameData.player2Score);
                    }else
                        alert("You can't place a piece there!");
                };
            }

            divCell.append(divPiece);
        }

        gameBoard.append(divRow);
    }
}

function changePlayerPieces(clickedRow, clickedColumn, player1){

    let piecesToChange = [], rowCheck, columnCheck, scoreToAdd = 0;

    // Check all eight directions
    for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {

        for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {

            if (rowDirection == 0 && columnDirection == 0)  // Skip the clicked position
                continue;

            // Move to next piece
            rowCheck = clickedRow + rowDirection;
            columnCheck = clickedColumn + columnDirection;

            let possiblePieces = [];

            // Look for valid pieces and pieces with opposite color
            while (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == !player1) {

                possiblePieces.push([rowCheck, columnCheck]);

                // Move to next position
                rowCheck += rowDirection;
                columnCheck += columnDirection;
            }

            if (possiblePieces.length) { // Found possible pieces to change
                // Check that the next piece is of the current player's color
                if (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == player1) {

                    // If so, add the last piece to the list to of pieces to change
                    piecesToChange.push([clickedRow, clickedColumn]);

                    for (let piece in possiblePieces) // And add the rest of the pieces to change
                        piecesToChange.push(possiblePieces[piece]);
                }
            }
        }
    }
    
    // Change pieces
    for (let i = 0; i < piecesToChange.length; i++) {
        if(gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].isPlayer1 != player1){
            scoreToAdd++;
            gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].element.classList.remove(player1 ? "black" : "white");
            gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].element.classList.add(player1 ? "white" : "black");
            gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].isPlayer1 = player1;
        }
    }

    return scoreToAdd; // Return the score to add
}

// Check board boundaries
function isValidPosition(row, column){
    return (row >= 0 && row < BOARD_DIMENSION) && (column >= 0 && column < BOARD_DIMENSION);
}

function isValidMove(clickedRow, clickedColumn, player1){ // player1 is white

    let rowCheck, columnCheck;

    if (!this.isValidPosition(clickedRow, clickedColumn) || gameData.board[clickedRow][clickedColumn].isPlayer1 != null)
        return false;

    // Check all eight directions
    for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {

        for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {

            if (rowDirection === 0 && columnDirection === 0) // Skip the clicked position
                continue;

            // Move to next piece
            rowCheck = clickedRow + rowDirection;
            columnCheck = clickedColumn + columnDirection;

            let pieceFound = false; 

             // Look for valid pieces and pieces with opposite color
            while (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == !player1) {

                // Move to next position
                rowCheck += rowDirection;
                columnCheck += columnDirection;

                pieceFound = true; 
            }

            if (pieceFound) {
                // Check that the next piece is of the current player's color
                if (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == player1)
                    return true; // Done - Valid move
            }
        }
    }
    return false; // Done - Invalid move
}