
const BOARD_DIMENSION = 8;
let player1sTurn = true;
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

            if((row == halfBoardDimension && column == halfBoardDimension) || (row == reverseHalfBoardDimension && column == reverseHalfBoardDimension)){
                divPiece.className += " white";
                boardData[row][column] = true; // player1 - white
            } else if((row == reverseHalfBoardDimension && column == halfBoardDimension) || (row == halfBoardDimension && column == reverseHalfBoardDimension)){
                divPiece.className += " black";
                boardData[row][column] = false; // player2 - black
            } else {
                boardData[row][column] = null;
                divPiece.onclick = () => {
                    if(checkClickPieceResults(row, column, player1sTurn))
                        player1sTurn = !player1sTurn;
                    else
                        alert("You can't place a piece there!");
                };
            }

            divCell.append(divPiece);
        }

        gameBoard.append(divRow);
    }
}

function checkClickPieceResults(clickedRow, clickedColumn, player1){ // player1 is white

    let atLeastOneValidResult = false;
    let resultsObject = {
        piecesToChangeLeft: 0,
        piecesToChangeRight: 0,
        piecesToChangeUp: 0,
        piecesToChangeDown: 0,
        foundOpponentPiece: false, 
        isValid: false
    };

    // check left
    resultsObject.foundOpponentPiece = false, resultsObject.isValid = false;
    for(let column = clickedColumn-1; column >= 0; column--){   
        if(checkForValidMove(clickedRow, column, player1, resultsObject))
            break;
        else
            resultsObject.piecesToChangeLeft++;
    }  

    if(resultsObject.isValid && resultsObject.piecesToChangeLeft > 0){
        atLeastOneValidResult = true;
        let rowColumnsElement = document.getElementsByClassName('board-row').item(clickedRow).children;
        for(let column = clickedColumn; column >= 0 && resultsObject.piecesToChangeLeft+1 > 0; column--, resultsObject.piecesToChangeLeft--){
            changePlayerPiece(rowColumnsElement, clickedRow, column, player1);
        }        
    }

    // check right
    resultsObject.foundOpponentPiece = false, resultsObject.isValid = false;
    for(let column = clickedColumn+1; column < BOARD_DIMENSION; column++){ 
        if(checkForValidMove(clickedRow, column, player1, resultsObject))
            break;
        else
            resultsObject.piecesToChangeRight++;
    }

    if(resultsObject.isValid && resultsObject.piecesToChangeRight > 0){
        atLeastOneValidResult = true;
        let rowColumnsElement = document.getElementsByClassName('board-row').item(clickedRow).children;
        for(let column = clickedColumn; column < BOARD_DIMENSION && resultsObject.piecesToChangeRight+1 > 0; column++, resultsObject.piecesToChangeRight--){ 
            changePlayerPiece(rowColumnsElement, clickedRow, column, player1);
        } 
    }

    // check up
    resultsObject.foundOpponentPiece = false, resultsObject.isValid = false;
    for(let row = clickedRow-1; row >= 0; row--){   
        if(checkForValidMove(row, clickedColumn, player1, resultsObject))
            break;
        else
            resultsObject.piecesToChangeUp++;
    }

    if(resultsObject.isValid && resultsObject.piecesToChangeUp > 0){
        atLeastOneValidResult = true;
        for(let row = clickedRow; row >= 0 && resultsObject.piecesToChangeUp+1 > 0; row--, resultsObject.piecesToChangeUp--){  
            let rowColumnsElement = document.getElementsByClassName('board-row').item(row).children;
            changePlayerPiece(rowColumnsElement, row, clickedColumn, player1);
        } 
    }

    // check down
    resultsObject.foundOpponentPiece = false, resultsObject.isValid = false;
    for(let row = clickedRow+1; row < BOARD_DIMENSION; row++){
        if(checkForValidMove(row, clickedColumn, player1, resultsObject))
            break;
        else
            resultsObject.piecesToChangeDown++;
    }

    if(resultsObject.isValid && resultsObject.piecesToChangeDown > 0){
        atLeastOneValidResult = true;
        for(let row = clickedRow; row < BOARD_DIMENSION && resultsObject.piecesToChangeDown+1 > 0; row++, resultsObject.piecesToChangeDown--){
            let rowColumnsElement = document.getElementsByClassName('board-row').item(row).children;
            changePlayerPiece(rowColumnsElement, row, clickedColumn, player1);
        }
    }

    return atLeastOneValidResult;
}

function changePlayerPiece(rowColumnsElement, row, column, player1){
    rowColumnsElement[column].children[0].classList.remove(player1 ? "black" : "white");
    rowColumnsElement[column].children[0].classList.add(player1 ? "white" : "black");
    boardData[row][column] = player1;
}

function checkForValidMove(row, column, player1, resultsObject){

    if(boardData[row][column] == null) // No piece
        return true;  // Done - invalid
    else if(boardData[row][column] == player1){ // Current player's piece
        if(resultsObject.foundOpponentPiece){
            resultsObject.isValid = true;
            return true; // Done - valid
        } else
            return true; // Done - invalid
    } else { // Opponent's piece
        resultsObject.foundOpponentPiece = true;
        return false; // Not done
    } 
}