import React, {Component} from "react";
import DominoTile from "../domino-tile/domino-tile.jsx";
import TilePosition from "../tile-position/tile-position.jsx";
import DominoStatistics from "../domino-statistics/domino-statistics.jsx";
import "./domino-game.css";
import GameOverPopup from "../game-over-popup/game-over-popup.jsx";
import WaitingForPlayersDialog from '../waiting-for-players-dialog.jsx';

class DominoGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dominoDeck: [],
            playerHand: [],
            availablePositions: [],
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
            gameStatus: "Pending",
        };

        this.gameTimeInterval = null;

        this.gameBoard = React.createRef();

        this.expandBoard = this.expandBoard.bind(this);
        this.placeSelectedTile = this.placeSelectedTile.bind(this);
        this.drawFromDeck = this.drawFromDeck.bind(this);
        this.selectTile = this.selectTile.bind(this);
        this.updateStatistics = this.updateStatistics.bind(this);
        this.updateGameTime = this.updateGameTime.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.createBoardTiles = this.createBoardTiles.bind(this);
        this.createAvailablePositions = this.createAvailablePositions.bind(this);
        this.createHand = this.createHand.bind(this);
        this.openGameOverPopup = this.openGameOverPopup.bind(this);
        this.closeGameOverPopup = this.closeGameOverPopup.bind(this);
        this.setGameOver = this.setGameOver.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.enableReplay = this.enableReplay.bind(this);
        this.getGameData = this.getGameData.bind(this);
    }

    componentDidMount() {
        this.startNewGame();
        this.getGameData();
    }

    componentWillUnmount() {
        clearInterval(this.gameTimeInterval);
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    placeSelectedTile(tilePosition) {
        if(!this.state.selectedTile){
            return;
        }

        fetch('/games/makeMove/placeTile', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                gameTitle: this.props.gameTitle,
                tile: this.state.selectedTile.props,
                position: tilePosition
            })})
        
    }

    drawFromDeck() {
        fetch('/games/makeMove/draw', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                gameTitle: this.props.gameTitle,
            })})
        
    }

    getFilteredBoardTilePositions(takenTilePosition) {
        let tilePositions = this.state.availablePositions.filter(tilePositionElem => {
            if (takenTilePosition.position.x === tilePositionElem.props.tilePosition.position.x && Math.abs(takenTilePosition.position.y - tilePositionElem.props.tilePosition.position.y) <= 1) {
                return false;
            }
            if (takenTilePosition.position.y === tilePositionElem.props.tilePosition.position.y && Math.abs(takenTilePosition.position.x - tilePositionElem.props.tilePosition.position.x) <= 1) {
                return false;
            }

            return true;
        });
        return tilePositions;
    }

    getGameData() {
        return fetch(`/games/gameData/${this.props.gameTitle}`, {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getGameData, 200);
                return response.json();
            })
            .then(gameData => {
                this.setState({
                        gameStatus: gameData.status,
                        gameData: gameData
                    },
                    this.updateGame);
            })
            .catch(err => {
                throw err
            });
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


            this.gameBoard.current.style.width = "";
            this.gameBoard.current.style.height = "";
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

    setGameOver() {
        if (!this.state.isGameOver) {
            this.setState({isGameOver: true});
            this.openGameOverPopup();
            clearInterval(this.gameTimeInterval);
        }
    }

    selectTile(clickedTile) {
        if(this.state.selectedTile === clickedTile){
            this.setState({selectedTile: null})
            return false;
        }

        if (this.state.selectedTile !== null) {
            for (let i = 0; i < this.state.playerHand.length; i++)
                this.state.playerHand[i].ref.current.toggleSelect(false);
        }

        this.setState({selectedTile: clickedTile}, ()=>{
            if (this.state.boardTiles.length === 0) {
                this.placeSelectedTile();
            }
        });
        if (this.state.boardTiles.length === 0){
            return false;
        }
        return true;
    }

    updateGame() {
        let boardTiles = this.createBoardTiles();
        let availablePositions = this.createAvailablePositions();
        let hand = this.createHand();
        this.setState({
            boardTiles: boardTiles,
            availablePositions: availablePositions,
            hand: hand
        })
    }

    createBoardTiles() {
        return this.state.gameData.boardTiles.map(boardTileData => <DominoTile
            key={`A${boardTileData.tile.numA}_B${boardTileData.tile.numB}`}
            inHand={false}
            ref={React.createRef()}
            numA={boardTileData.tile.numA}
            numB={boardTileData.tile.numB}
            animation={{onBoard: true}}
            position={boardTileData.position}
        />)
    }

    createAvailablePositions() {
        return this.state.gameData.availablePositions.map(availablePositionData => <TilePosition
            key={`${availablePositionData.requiredNum}_${availablePositionData.position.x}_${availablePositionData.position.y}_${availablePositionData.position.spin}`}
            tilePosition={availablePositionData}
            placeSelectedTile={this.placeSelectedTile}
        />)
    }

    createHand() {
        if (Array.isArray(this.state.gameData.hand)) {
            return this.state.gameData.hand.map(handTileData => <DominoTile
                key={`A${handTileData.numA}_B${handTileData.numB}`}
                inHand={true}
                ref={React.createRef()}
                animation={{inHand: true}}
                numA={handTileData.numA}
                numB={handTileData.numB}
                position={{
                    x: 0,
                    y: 0,
                    spin: 0
                }}
                selectTile={this.selectTile}
            />)
        }
        return [];
    }

    expandBoard(position) {
        let tileHeight = 72;
        let tileWidth = 36;
        let scrollLeft = this.gameBoard.current.parentElement.scrollLeft;
        let scrollTop = this.gameBoard.current.parentElement.scrollTop;

        if (!this.gameBoard.current.style.width) {
            this.gameBoard.current.style.width = this.gameBoard.current.clientWidth + "px";
        }
        if (!this.gameBoard.current.style.height) {
            this.gameBoard.current.style.height = this.gameBoard.current.clientHeight + "px";
        }

        if (position.spin % 2 === 0) {
            this.gameBoard.current.style.width = `${this.gameBoard.current.clientWidth + tileWidth}px`;
            this.gameBoard.current.style.height = `${this.gameBoard.current.clientHeight + tileHeight * 2}px`;
            scrollLeft += tileWidth / 3;
            scrollTop += tileHeight;
        } else {
            this.gameBoard.current.style.width = `${this.gameBoard.current.clientHeight + tileHeight * 2}px`;
            this.gameBoard.current.style.height = `${this.gameBoard.current.clientWidth + tileWidth}px`;

            if (this.state.boardTiles.length == 2)
                scrollTop += tileWidth * 8;
            else
                scrollTop += tileWidth * 2.5;

            scrollLeft += tileHeight * 1.5;

        }
        this.gameBoard.current.parentElement.scrollTo(scrollLeft, scrollTop);
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
                        {this.state.hand}
                    </div>
                    <div>
                        <button className="my-button" onClick={() => this.drawFromDeck()}
                                disabled={this.state.dominoDeck.length === 0 || this.state.isGameOver}>
                            {this.state.dominoDeck.length !== 0 ? "Draw From Deck" : "No more tiles"}
                        </button>
                        <button className="my-button" onClick={() => this.previousHistory(true)}
                                hidden={this.state.isGameOver} disabled={this.state.gameHistoryRound === 0}>Undo Move
                        </button>
                        <button className="my-button" onClick={this.startNewGame}
                                hidden={!this.state.isGameOver || this.state.showGameOverPopup}>Start a
                            New Game
                        </button>
                        <button className="my-button" onClick={() => this.previousHistory(false)}
                                disabled={this.state.gameHistoryRound === 0}
                                hidden={this.state.disableReplay}>
                            Previous
                        </button>
                        <button className="my-button" onClick={this.nextHistory}
                                disabled={this.state.gameHistoryRound === this.state.gameHistory.length - 1}
                                hidden={this.state.disableReplay}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="row-container">
                    <div className="game-board-container">
                        <div className="game-board" ref={this.gameBoard}>
                            <div className="tiles-container">
                                {this.state.boardTiles}
                            </div>
                            <div className="tile-positions-container">
                                {this.state.availablePositions}
                            </div>
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
                    <div hidden={this.state.gameStatus !== "Pending" && this.state.gameData.isMyTurn} className="dialog-overlay">
                        <WaitingForPlayersDialog
                            //leaveGameFunction={this.handleLeaveGame}
                            allPlayersAreIn={this.state.gameStatus !== "Pending"}
                            currentPlayerName={this.state.gameData ? this.state.gameData.currentPlayerName : null}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default DominoGame;