import React, { Component } from "react";
import DominoBoard from "./domino-board.jsx";
import DominoTile from "./domino-tile.jsx";
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
    for(let i = 0; i < 7; i++){
      for(let j = 0; j <= i; j++){
        this.state.dominoDeck.push({firstDots: i, secondDots: j});
      }
    }

    this.state.headTile = React.createRef();
    this.gameBoard = React.createRef();

    this.drawFromDeck = this.drawFromDeck.bind(this);
    this.setTileToAdd = this.setTileToAdd.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.removeTileFromHand = this.removeTileFromHand.bind(this);
  }

  componentDidMount(){
    // Draw 6 tiles to the player's hand
    for(let i = 0; i < 6; i++)
      this.drawFromDeck();
  }

  selectTile(clickedTile){
    
    let currentBoardTiles = this.state.boardTiles;

    if(currentBoardTiles.length == 0){

      currentBoardTiles.push(
        <DominoTile 
          key={"tile-first"+clickedTile.props.firstDots+"second"+clickedTile.props.secondDots} 
          inHand={false} 
          firstDots={clickedTile.props.firstDots} 
          secondDots={clickedTile.props.secondDots}
          ref={this.state.headTile}
        />
      );
      
      this.removeTileFromHand(clickedTile);

    } else {

      this.setState({selectedTile: clickedTile});
    }
  }

  removeTileFromHand(tile){
    let currentPlayerHand = this.state.playerHand;
    let index = currentPlayerHand.findIndex(a => a.props.firstDots == tile.props.firstDots && a.props.secondDots == tile.props.secondDots);
    
    if (index > -1) {
      currentPlayerHand.splice(index, 1);
    }

    this.setState({playerHand: currentPlayerHand});
  }

  setTileToAdd(tile){
    this.setState({tileToAdd: tile});
    this.gameBoard.current.addTile(tile);
  }

  drawFromDeck(){
    let currentPlayerHand = this.state.playerHand;
    let randomNumber = Math.floor(Math.random() * this.state.dominoDeck.length); // returns a random integer from 0 to the number of tiles in the deck
    let tile = this.state.dominoDeck.splice(randomNumber, 1)[0];

    currentPlayerHand.push(
      <DominoTile 
        key={"tile-first"+tile.firstDots+"second"+tile.secondDots} 
        inHand={true} 
        firstDots={tile.firstDots} 
        secondDots={tile.secondDots}
        onClick={clickedTile => {this.selectTile(clickedTile)}}
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