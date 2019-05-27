import React, { Component } from "react";
import DominoStatistics from "../domino-statistics/domino-statistics.jsx";
import DominoTile from "../domino-tile/domino-tile.jsx";
import "./domino-board.css";

class DominoBoard extends Component {
  constructor() {
    super();
    this.state = {
     renderedTiles: []
    };

    this.addTile = this.addTile.bind(this);
  }

  addTile(tile){
    let currentRenderedTiles = this.state.renderedTiles;
    currentRenderedTiles.push(tile);

    this.setState({renderedTiles: currentRenderedTiles});
  }

  render() {
    return (
      <div className="game-view">
        <div className="game-container">
          <div></div>
          <div className="height-cancel">
              <div className="board-container">
                  <div className="board">
                    {this.state.renderedTiles}
                  </div>
                  <div className="popup-message">
                      <h1>Game Over!</h1>
                      <div className="popup-text">this is the message!</div>
                      <button className="button" onClick={this.hidePopup}>OK!</button>
                  </div>
              </div>
          </div>
          <DominoStatistics></DominoStatistics>
        </div>
      </div>
    );
  }
}
export default DominoBoard;