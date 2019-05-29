import React, {Component} from "react";
import DominoTile from "../domino-tile/domino-tile.jsx";
import "./domino-game.css";

class DominoGame extends Component {
    constructor() {
        super();
        this.state = {
            dominoDeck: [],
            playerHand: [],
            headTile: null,
            selectedTile: null,
            boardTiles: []
        };

        // Generate deck tiles
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                this.state.dominoDeck.push({numA: i, numB: j});
            }
        }

        this.state.headTile = React.createRef();
        this.gameBoard = React.createRef();
        this.availablePositions = {};


        this.updateTilePositions = this.updateTilePositions.bind(this);
        this.placeSelectedTile = this.placeSelectedTile.bind(this);
        this.shouldSpinSelectedTile = this.shouldSpinSelectedTile.bind(this);
        this.canPlaceSelectedTile = this.canPlaceSelectedTile.bind(this);
        this.getSelectedTile = this.getSelectedTile.bind(this);
        this.addTileToBoard = this.addTileToBoard.bind(this);
        this.drawFromDeck = this.drawFromDeck.bind(this);
        this.setTileToAdd = this.setTileToAdd.bind(this);
        this.selectTile = this.selectTile.bind(this);
        this.removeTileFromHand = this.removeTileFromHand.bind(this);
    }

    componentDidMount() {
        // Draw 6 tiles to the player's hand
        for (let i = 0; i < 6; i++)
            this.drawFromDeck();
    }

    selectTile(clickedTile) {
        if (this.state.boardTiles.length === 0) {
            this.addTileToBoard(clickedTile, {x: 0, y: 0, spin: 0});
            this.removeTileFromHand(clickedTile);
        } else {
            this.setState({selectedTile: clickedTile});
        }
    }

    addTileToBoard(tile, position, fatherPosition) {
        this.state.boardTiles.push(
            <DominoTile
                key={`A${tile.props.numA}_B${tile.props.numB}`}
                inHand={false}
                numA={tile.props.numA}
                numB={tile.props.numB}
                ref={this.state.headTile}
                position={position}
                updateTilePositions={this.updateTilePositions}
                placeSelectedTile={this.placeSelectedTile}
                fatherPosition={fatherPosition}
                onClick={clickedTile => {
                    this.selectTile(clickedTile)
                }}
            />
        )
    }

    updateTilePositions(positions, key) {
        this.availablePositions[key] = positions;
    }

    getSelectedTile() {
        return this.state.selectedTile;
    }


    placeSelectedTile(tilePosition, fatherPosition, onSuccess) {
        if (this.canPlaceSelectedTile(tilePosition)) {
            if (this.shouldSpinSelectedTile(tilePosition)) {
                tilePosition.position.spin += 2;
            }
            this.removeTileFromHand(this.state.selectedTile);
            this.addTileToBoard(this.state.selectedTile, tilePosition.position, fatherPosition);
            this.setState({selectedTile: null});
            onSuccess();
        } else {
            console.warn("tried to place tile in wrong position");
        }
    }

    shouldSpinSelectedTile(tilePosition) {
        return this.state.selectedTile.props.numB === tilePosition.requiredNum;
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

    setTileToAdd(tile) {
        this.setState({tileToAdd: tile});
        this.gameBoard.current.addTile(tile);
    }

    drawFromDeck() {
        let currentPlayerHand = this.state.playerHand;
        let randomNumber = Math.floor(Math.random() * this.state.dominoDeck.length); // returns a random integer from 0 to the number of tiles in the deck
        let tile = this.state.dominoDeck.splice(randomNumber, 1)[0];

        currentPlayerHand.push(
            <DominoTile
                key={`A${tile.numA}_B${tile.numB}`}
                inHand={true}
                numA={tile.numA}
                numB={tile.numB}
                position={{
                    x: 0,
                    y: 0,
                    spin: 0
                }}
                onClick={clickedTile => {
                    this.selectTile(clickedTile)
                }}
                addTilePositions={this.updateTilePositions}
                placeSelectedTile={this.placeSelectedTile}
            />
        );

        this.setState({playerHand: currentPlayerHand});
    }

    render() {
        return (
            <div>
                <div className="view-header">
                    <div className="player-hand-title"><span>Hand: </span></div>
                    <div className="player-hand">
                        {this.state.playerHand}
                    </div>
                    <div>
                        <button className="button" onClick={this.drawFromDeck}>Draw From Deck</button>
                    </div>
                </div>
                <div className="game-board">
                    {this.state.boardTiles}
                </div>
            </div>
        );
    }
}

export default DominoGame;