import React, { Component } from "react";
import "./domino-statistics.css";

class DominoStatistics extends Component {
  constructor() {
    super();
    
    this.formatTime = this.formatTime.bind(this);
  }

  formatTime(time) {
    let minutes = parseInt(time / 60);
    let seconds = parseInt(time - (minutes * 60));

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return minutes + ":" + seconds;
  }

  render() {
    return (
      <div className="statistics-sidebar">
        <h2>Game Statistics</h2>
        <div className="statistics-field-container">
            <label className="statistics-field-name">Game Time:</label>
            <div className="statistics-data">{this.formatTime(this.props.gameTime)}</div>
        </div>
        <div className="statistics-field-container">
            <label className="statistics-field-name">Total Turns:</label>
            <div className="statistics-data">{this.props.totalTurns}</div>
        </div>
        <div>
           {/* <h4>
                Player 1:
           </h4>*/}
          <div className="player-statistics-container">
              <div className="statistics-field-container">
                  <label className="statistics-field-name">Score:</label>
                  <div className="statistics-data">{this.props.score}</div>
              </div>
              <div className="statistics-field-container">
                  <label className="statistics-field-name">Number Of Draws From Deck:</label>
                  <div className="statistics-data">{this.props.numOfDraws}</div>
              </div>
              <div className="statistics-field-container">
                  <label className="statistics-field-name">Average Turn Time:</label>
                  <div className="statistics-data">{this.formatTime(this.props.averageTurnTime)}</div>
              </div>
          </div>
        </div>
    </div>
    );
  }
}
export default DominoStatistics;