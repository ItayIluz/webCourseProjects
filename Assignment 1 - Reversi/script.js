
const BOARD_DIMENSION = 8;
let gameData = {
    board: [],
    player1sTurn: true,
    totalTurns: 0,
    
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
                        changePlayerPieces(row, column, gameData.player1sTurn);
                        gameData.player1sTurn = !gameData.player1sTurn;
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

    let piecesToChange = [], rowCheck, columnCheck;

    // check all eight directions
    for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {

        for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {

            // dont check the actual position
            if (rowDirection === 0 && columnDirection === 0) 
                continue;

            // move to next item
            rowCheck = clickedRow + rowDirection;
            columnCheck = clickedColumn + columnDirection;

            // possible items array
            let possiblePieces = [];

            // look for valid items
            // look for visible items
            // look for items with opposite color
            while (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == !player1) {

                possiblePieces.push([rowCheck, columnCheck]);

                // move to next position
                rowCheck += rowDirection;
                columnCheck += columnDirection;
            }

            // if some items were found
            if (possiblePieces.length) {

                // now we need to check that the next item is one of ours
                if (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == player1) {

                    // push the actual item
                    piecesToChange.push([clickedRow, clickedColumn]);

                    // push each item actual line
                    for (let item in possiblePieces)
                        piecesToChange.push(possiblePieces[item]);
                }
            }
        }
    }
    
    // check for items to check
    for (let i = 0; i < piecesToChange.length; i++) {
        gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].element.classList.remove(player1 ? "black" : "white");
        gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].element.classList.add(player1 ? "white" : "black");
        gameData.board[piecesToChange[i][0]][piecesToChange[i][1]].isPlayer1 = player1;
    }

    return piecesToChange.length;
}

function isValidPosition(row, column){
    return (row >= 0 && row < BOARD_DIMENSION) && (column >= 0 && column < BOARD_DIMENSION);
}

function isValidMove(clickedRow, clickedColumn, player1){ // player1 is white

    let rowCheck, columnCheck;

    if (!this.isValidPosition(clickedRow, clickedColumn) || gameData.board[clickedRow][clickedColumn].isPlayer1 != null)
        return false;

    // check all eight directions
    for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {

        for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {

            // dont check the actual position
            if (rowDirection === 0 && columnDirection === 0) 
                continue;

            // move to next item
            rowCheck = clickedRow + rowDirection;
            columnCheck = clickedColumn + columnDirection;

            // were any items found ?
            let itemFound = false;

            // look for valid items
            // look for visible items
            // look for items with opposite color
            while (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == !player1) {

                // move to next position
                rowCheck += rowDirection;
                columnCheck += columnDirection;

                // item found
                itemFound = true; 
            }

            // if some items were found
            if (itemFound) {

                // now we need to check that the next item is one of ours
                if (this.isValidPosition(rowCheck, columnCheck) && gameData.board[rowCheck][columnCheck].isPlayer1 != null && gameData.board[rowCheck][columnCheck].isPlayer1 == player1) {

                    // we have a valid move
                    return true;
                }
            }
        }
    }

    return false;
}