import React, { Component } from "react";
import DominoStatistics from "./domino-statistics.jsx";
import DominoTile from "./domino-tile.jsx";
import "./domino-board.css";

class DominoBoard extends Component {
  constructor() {
    super();
    this.state = {
     
    };
  }
  render() {
    return (
      <div className="game-view">
        <div id="domino-game" className="game-container">
          <div></div>
          <div className="height-cancel">
              <div className="board-container">
                  <div id="domino-board" className="board">
                    <DominoTile firstDots="1" secondDots="6"/>
                    <div>abc</div>
                    <DominoTile firstDots="2" secondDots="5"/>
                    <div>abc</div>
                    <DominoTile firstDots="3" secondDots="4"/>
                  </div>
                  <div id="popup-message" className="popup-message">
                      <h1>Game Over!</h1>
                      <div id="popup-text" className="popup-text">this is the message!</div>
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