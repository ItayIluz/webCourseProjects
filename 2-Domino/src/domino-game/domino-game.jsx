import React, {Component} from "react";
import DominoTile from "../domino-tile/domino-tile.jsx";
import DominoStatistics from "../domino-statistics/domino-statistics.jsx";
import "./domino-game.css";
import GameOverPopup from "../game-over-popup/game-over-popup.jsx";

class DominoGame extends Component {
    constructor() {
        super();
        this.state = {
            dominoDeck: [],
            playerHand: [],
            selectedTile: null,
            boardTiles: [],
            score: 0,
            gameTime: 0,
            totalTurns: 0,
            numOfDraws: 0,
            averageTurnTime: 0,
            showGameOverPopup: false,
            gameHistory: [],
            gameHistoryRound: -1,
            isGameOver: false,
            disableReplay: true,
        };

        this.gameTimeInterval = null;

        this.tilesContainer = React.createRef();
        this.availablePositions = {};

        this.expandBoard = this.expandBoard.bind(this);
        this.hasNoValidMoves = this.hasNoValidMoves.bind(this);
        this.updateTilePositions = this.updateTilePositions.bind(this);
        this.placeSelectedTile = this.placeSelectedTile.bind(this);
        this.shouldSpinSelectedTile = this.shouldSpinSelectedTile.bind(this);
        this.canPlaceSelectedTile = this.canPlaceSelectedTile.bind(this);
        this.addTileToBoard = this.addTileToBoard.bind(this);
        this.drawFromDeck = this.drawFromDeck.bind(this);
        this.selectTile = this.selectTile.bind(this);
        this.removeTileFromHand = this.removeTileFromHand.bind(this);
        this.updateStatistics = this.updateStatistics.bind(this);
        this.updateGameTime = this.updateGameTime.bind(this);
        this.checkGameOver = this.checkGameOver.bind(this);
        this.openGameOverPopup = this.openGameOverPopup.bind(this);
        this.closeGameOverPopup = this.closeGameOverPopup.bind(this);
        this.setGameOver = this.setGameOver.bind(this);
        this.addGameHistory = this.addGameHistory.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.previousHistory = this.previousHistory.bind(this);
        this.nextHistory = this.nextHistory.bind(this);
        this.enableReplay = this.enableReplay.bind(this);
    }

    componentDidMount() {
        this.startNewGame();
    }

    startNewGame() {

        if (this.state.isGameOver)
            this.closeGameOverPopup();

        let newDominoDeck = [];
        // Generate deck tiles
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                newDominoDeck.push({numA: i, numB: j});
            }
        }

        this.gameTimeInterval = setInterval(this.updateGameTime, 1000);

        this.setState({
            dominoDeck: newDominoDeck,
            playerHand: [],
            selectedTile: null,
            boardTiles: [],
            score: 0,
            gameTime: 0,
            totalTurns: 0,
            numOfDraws: 0,
            averageTurnTime: 0,
            showGameOverPopup: false,
            gameHistory: [],
            gameHistoryRound: -1,
            isGameOver: false,
            disableReplay: true,
        }, () => {
            // Draw 6 tiles to the player's hand
            for (let i = 0; i < 6; i++)
                this.drawFromDeck(true);
        });
    }

    updateGameTime() {
        this.setState({
            gameTime: this.state.gameTime + 1
        });
    }

    updateStatistics(addedTile) {
        let newScore = this.state.score + addedTile.props.numA + addedTile.props.numB;
        let newTotalTurns = this.state.totalTurns + 1;
        this.setState({
            score: newScore,
            totalTurns: newTotalTurns,
            averageTurnTime: this.state.gameTime / newTotalTurns
        })
    }

    componentWillUnmount() {
        clearInterval(this.gameTimeInterval);
    }

    checkGameOver() {
        if (this.state.dominoDeck.length !== 0) {
            return;
        }
        if (this.state.playerHand.length === 0) {
            this.setGameOver();
        } else if (this.hasNoValidMoves()) {
            this.setGameOver();
        }
    }

    hasNoValidMoves() {
        return !this.state.playerHand
            .some(tile => Object.values(this.availablePositions)
                .some(positions => positions
                    .some(position => tile.props.numA === position.requiredNum || tile.props.numB === position.requiredNum)));
    }

    setGameOver() {
        this.setState({isGameOver: true});
        this.openGameOverPopup();
        clearInterval(this.gameTimeInterval);
    }

    selectTile(clickedTile) {
        if (this.state.boardTiles.length === 0) {
            this.addTileToBoard(clickedTile, {x: 0, y: 0, spin: 0});
            this.removeTileFromHand(clickedTile);
        } else {
            if (this.state.selectedTile !== null && this.state.selectedTile !== clickedTile) {
                for (let i = 0; i < this.state.playerHand.length; i++)
                    this.state.playerHand[i].ref.current.toggleSelect(false);
            }

            this.setState({selectedTile: clickedTile});
        }
    }

    addTileToBoard(tile, position, fatherPosition) {
        let currentBoard = this.state.boardTiles;

        currentBoard.push(
            <DominoTile
                key={`A${tile.props.numA}_B${tile.props.numB}`}
                inHand={false}
                ref={React.createRef()}
                numA={tile.props.numA}
                numB={tile.props.numB}
                animation={{onBoard: true}}
                position={position}
                updateTilePositions={this.updateTilePositions}
                placeSelectedTile={this.placeSelectedTile}
                fatherPosition={fatherPosition}
                onClick={this.selectTile}
            />
        );

        this.setState({boardTiles: currentBoard}, () => {
            setTimeout(() => {
                this.expandBoard(position);
            }, 0);
            this.updateStatistics(tile);
            this.addGameHistory();
        });
    }

    updateTilePositions(positions, key) {
        this.availablePositions[key] = positions;
        this.checkGameOver();
    }

    placeSelectedTile(tilePosition, fatherPosition, onSuccess) {
        if (this.canPlaceSelectedTile(tilePosition)) {
            if (this.shouldSpinSelectedTile(tilePosition)) {
                tilePosition.position.spin += 2;
            }
            this.removeTileFromHand(this.state.selectedTile);
            this.addTileToBoard(this.state.selectedTile, tilePosition.position, fatherPosition);
            this.setState({selectedTile: null});
            this.checkGameOver();
            onSuccess();
        }
    }


    shouldSpinSelectedTile(tilePosition) {
        return this.state.selectedTile.props.numB === tilePosition.requiredNum;
    }

    expandBoard(position) {
        let tileHeight = 72;
        let tileWidth = 36;
        let scrollLeft = this.tilesContainer.current.parentElement.scrollLeft;
        let scrollTop = this.tilesContainer.current.parentElement.scrollTop;

        if (!this.tilesContainer.current.style.width) {
            this.tilesContainer.current.style.width = this.tilesContainer.current.clientWidth + "px";
        }
        if (!this.tilesContainer.current.style.height) {
            this.tilesContainer.current.style.height = this.tilesContainer.current.clientHeight + "px";
        }

        if (position.spin % 2 === 0) {
            this.tilesContainer.current.style.width = `${this.tilesContainer.current.clientWidth + tileWidth}px`;
            this.tilesContainer.current.style.height = `${this.tilesContainer.current.clientHeight + tileHeight * 2}px`;
            scrollLeft -= tileWidth;
            scrollTop -= tileHeight * 2;
        } else {
            this.tilesContainer.current.style.width = `${this.tilesContainer.current.clientHeight + tileHeight * 2}px`;
            this.tilesContainer.current.style.height = `${this.tilesContainer.current.clientWidth + tileWidth}px`;
            scrollTop -= tileWidth;
            scrollLeft -= tileHeight * 2;
        }
        this.tilesContainer.current.parentElement.scrollTo(scrollLeft, scrollTop);
    }

    canPlaceSelectedTile(tilePosition) {
        if (!this.state.selectedTile) {
            return false;
        }
        if (!(this.state.selectedTile.props.numA === tilePosition.requiredNum || this.state.selectedTile.props.numB === tilePosition.requiredNum)) {
            return false;
        }
        if (tilePosition.doubleRequired && this.state.selectedTile.props.numA !== this.state.selectedTile.props.numB) {
            return false;
        }

        return true;

    }

    removeTileFromHand(tile) {
        let currentPlayerHand = this.state.playerHand;
        let index = currentPlayerHand.findIndex(a => a.props.numA === tile.props.numA && a.props.numB === tile.props.numB);

        if (index > -1) {
            currentPlayerHand.splice(index, 1);
        }

        this.setState({playerHand: currentPlayerHand});
    }


    drawFromDeck(gameStart) {
        let currentPlayerHand = this.state.playerHand;
        let randomNumber = Math.floor(Math.random() * this.state.dominoDeck.length); // returns a random integer from 0 to the number of tiles in the deck
        let tile = this.state.dominoDeck.splice(randomNumber, 1)[0];

        currentPlayerHand.push(
            <DominoTile
                key={`A${tile.numA}_B${tile.numB}`}
                inHand={true}
                ref={React.createRef()}
                animation={{inHand: true}}
                numA={tile.numA}
                numB={tile.numB}
                position={{
                    x: 0,
                    y: 0,
                    spin: 0
                }}
                onClick={this.selectTile}
                addTilePositions={this.updateTilePositions}
                placeSelectedTile={this.placeSelectedTile}
            />
        );

        if (!gameStart) {
            this.setState({
                playerHand: currentPlayerHand,
                numOfDraws: this.state.numOfDraws + 1
            }, () => this.addGameHistory());
        } else {
            if (this.state.playerHand.length === 6)
                this.addGameHistory();
        }
    }

    addGameHistory() {
        let updatedGameHistory = this.state.gameHistory;
        let playerHandCopy = [];
        let boardTilesCopy = [];

        for (let i = 0; i < this.state.playerHand.length; i++)
            playerHandCopy.push(React.cloneElement(this.state.playerHand[i]));

        for (let i = 0; i < this.state.boardTiles.length; i++)
            boardTilesCopy.push(React.cloneElement(this.state.boardTiles[i]));

        updatedGameHistory.push({
            playerHand: playerHandCopy,
            boardTiles: boardTilesCopy,
            score: this.state.score,
            gameTime: this.state.gameTime,
            totalTurns: this.state.totalTurns,
            numOfDraws: this.state.numOfDraws,
            averageTurnTime: this.state.averageTurnTime,
        });
        this.setState({gameHistory: updatedGameHistory, gameHistoryRound: this.state.gameHistoryRound + 1});
    }

    previousHistory(isUndo) {
        let currentGameHistory = this.state.gameHistory;
        let round = this.state.gameHistoryRound - 1;
        if (round >= 0) {

            let undoChangedBoard = false;
            let removedTile;
            let newPlayHand = [];
            let newBoardTiles = [];

            if (isUndo) {
                undoChangedBoard = currentGameHistory[round + 1].numOfDraws === currentGameHistory[round].numOfDraws;
                removedTile = currentGameHistory[round + 1].boardTiles[currentGameHistory[round + 1].boardTiles.length - 1];
                currentGameHistory.pop();

                for (let i = 0; i < currentGameHistory[round].playerHand.length; i++)
                    newPlayHand.push(React.cloneElement(currentGameHistory[round].playerHand[i]));

                for (let i = 0; i < currentGameHistory[round].boardTiles.length; i++)
                    newBoardTiles.push(React.cloneElement(currentGameHistory[round].boardTiles[i]));
            } else {
                newPlayHand = currentGameHistory[round].playerHand;
                newBoardTiles = currentGameHistory[round].boardTiles;
            }

            this.setState({
                boardTiles: newBoardTiles,
                playerHand: newPlayHand,
                score: currentGameHistory[round].score,
                gameTime: currentGameHistory[round].gameTime,
                totalTurns: currentGameHistory[round].totalTurns,
                numOfDraws: currentGameHistory[round].numOfDraws,
                averageTurnTime: currentGameHistory[round].averageTurnTime,
                gameHistory: currentGameHistory,
                gameHistoryRound: round,
            }, () => {
                if (undoChangedBoard) {
                    let fatherTile = newBoardTiles.find(tile => tile.props.position.x === removedTile.props.fatherPosition.x && tile.props.position.y === removedTile.props.fatherPosition.y && tile.props.position.spin === removedTile.props.fatherPosition.spin);
                    if (fatherTile) {
                        fatherTile.ref.current.addLostPositionsToPossibleAdjacentTiles(removedTile.props.position);
                    }
                }
            });
        }
    }

    nextHistory() {
        let round = this.state.gameHistoryRound + 1;
        if (round < this.state.gameHistory.length) {
            this.setState({
                boardTiles: this.state.gameHistory[round].boardTiles,
                playerHand: this.state.gameHistory[round].playerHand,
                score: this.state.gameHistory[round].score,
                gameTime: this.state.gameHistory[round].gameTime,
                totalTurns: this.state.gameHistory[round].totalTurns,
                numOfDraws: this.state.gameHistory[round].numOfDraws,
                averageTurnTime: this.state.gameHistory[round].averageTurnTime,
                gameHistoryRound: round,
            })
        }
    }

    enableReplay() {
        this.setState({disableReplay: false}, this.closeGameOverPopup);
    }

    openGameOverPopup() {
        this.setState({showGameOverPopup: true})
    }

    closeGameOverPopup() {
        this.setState({showGameOverPopup: false})
    }

    render() {
        return (
            <div className="main-container">
                <div className="view-header">
                    <div className="player-hand-title"><span>Hand: </span></div>
                    <div className="player-hand">
                        {this.state.playerHand}
                    </div>
                    <div>
                        <button className="button" onClick={() => this.drawFromDeck(false)}
                                disabled={this.state.dominoDeck.length === 0}>
                            {this.state.dominoDeck.length !== 0 ? "Draw From Deck" : "No more tiles"}
                        </button>
                        <button className="button" onClick={() => this.previousHistory(true)}
                                hidden={this.state.isGameOver} disabled={this.state.gameHistoryRound === 0}>Undo Move
                        </button>
                        <button className="button" onClick={this.startNewGame} hidden={!this.state.isGameOver}>Start a
                            New Game
                        </button>
                        <button className="button" onClick={() => this.previousHistory(false)}
                                disabled={this.state.gameHistoryRound === 0}
                                hidden={this.state.disableReplay}>
                            Previous
                        </button>
                        <button className="button" onClick={this.nextHistory}
                                disabled={this.state.gameHistoryRound === this.state.gameHistory.length - 1}
                                hidden={this.state.disableReplay}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="row-container">
                    <div className="game-board">
                        <div className="tiles-container" ref={this.tilesContainer}>
                            {this.state.boardTiles}
                        </div>
                    </div>
                    <DominoStatistics
                        gameTime={this.state.gameTime}
                        totalTurns={this.state.totalTurns}
                        score={this.state.score}
                        averageTurnTime={this.state.averageTurnTime}
                        numOfDraws={this.state.numOfDraws}
                    />
                    <GameOverPopup
                        showPopup={this.state.showGameOverPopup}
                        startNewGameFunction={this.startNewGame}
                        enableReplayFunction={this.enableReplay}
                        closeFunction={this.closeGameOverPopup}
                    />
                </div>
            </div>
        );
    }
}

export default DominoGame;