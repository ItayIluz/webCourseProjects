
const BOARD_DIMENSION = 8;
let boardData = [];

function buildBoard(){

    let divRow, divCell, divPiece,
        halfBoardDimension = (BOARD_DIMENSION / 2) - 1,
        reverseHalfBoardDimension = BOARD_DIMENSION - 1 - halfBoardDimension,
        gameBoard = document.getElementById("reversi-board");

    for(let row = 0; row < BOARD_DIMENSION; row++){
        
        boardData[row] = [];
        divRow = document.createElement("div");
        divRow.className = "board-row";

        for(let column = 0; column < BOARD_DIMENSION; column++){
            divCell = document.createElement("div");
            divCell.className = "board-cell";
            divRow.append(divCell);

            divPiece = document.createElement("div");
            divPiece.className = "board-piece";

            if((row == halfBoardDimension && column == halfBoardDimension) || (row == reverseHalfBoardDimension && column == reverseHalfBoardDimension))
                divPiece.className += " white";
            
            if((row == reverseHalfBoardDimension && column == halfBoardDimension) || (row == halfBoardDimension && column == reverseHalfBoardDimension))
                divPiece.className += " black";

            divCell.append(divPiece);
        }

        gameBoard.append(divRow);
    }
}