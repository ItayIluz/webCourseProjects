import React, { Component } from "react";
import "./domino-statistics.css";

class DominoStatistics extends Component {
  constructor() {
    super();
    this.state = {
      
    };
  }
  render() {
    return (
      <div className="statistics-sidebar">
        <div>
            <h2>Game Statistics</h2>
            <div className="statistics-field-container">
                <label className="statistics-field-name">Game Time:</label>
                <div id="statistics-game-time" className="statistics-data">00:00</div>
            </div>
            <div className="statistics-field-container">
                <label className="statistics-field-name">Total Turns:</label>
                <div id="statistics-total-turns" className="statistics-data"></div>
            </div>
        </div>
        <div>
            <h4>
                Player 1:
            </h4>
            <div className="player-statistics-container">

                <div className="statistics-field-container">
                    <label className="statistics-field-name">Score:</label>
                    <div id="statistics-player1-score" className="statistics-data"></div>
                </div>
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Two Pieces Count:</label>
                    <div id="statistics-player1-two-pieces-count"
                        className="statistics-data"></div>
                </div>
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Average Turn Time:</label>
                    <div id="statistics-player1-average-turn-time" className="statistics-data"></div>
                </div>
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Average Turn Time (All Games):</label>
                    <div id="statistics-player1-average-turn-time-all-games" className="statistics-data"></div>
                </div>
            </div>
        </div>
        <div>
            <h4>
                Player 2:
            </h4>
            <div className="player-statistics-container">
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Score:</label>
                    <div id="statistics-player2-score" className="statistics-data"></div>
                </div>
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Two Pieces Count:</label>
                    <div id="statistics-player2-two-pieces-count"
                        className="statistics-data"></div>
                </div>
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Average Turn Time:</label>
                    <div id="statistics-player2-average-turn-time" className="statistics-data"></div>
                </div>
                <div className="statistics-field-container">
                    <label className="statistics-field-name">Average Turn Time (All Games):</label>
                    <div id="statistics-player2-average-turn-time-all-games" className="statistics-data"></div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}
export default DominoStatistics;