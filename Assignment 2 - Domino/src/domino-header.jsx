import React, { Component } from "react";
import "./domino-header.css";

class DominoHeader extends Component {
  constructor() {
    super();
    this.state = {
     
    };
  }
  render() {
    return (
    <header className="view-header">
        <h1>Domino Game</h1>
        <div>
            <label className="current-players-turn-container">Current Player's Turn: </label><span
                id="current-players-turn"></span>
        </div>
        <div>
            <label className="show-score-label">Show score: </label>
            <input type="checkbox" id="show-score-checkbox" className="show-score-checkbox"/>
        </div>
        <div>
            <button id="quitOrRestartButton" className="button quit-button">Quit Game</button>
        </div>
    </header>
    );
  }
}
export default DominoHeader;