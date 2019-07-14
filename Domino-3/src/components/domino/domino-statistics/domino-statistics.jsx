import React, { Component } from "react";
import "./domino-statistics.css";

class DominoStatistics extends Component {
  constructor() {
    super();
    
    this.formatTime = this.formatTime.bind(this);
    this.createPlayersStatus = this.createPlayersStatus.bind(this);
  }

  formatTime(time) {
    if(!time){
      return "0:0"
    }

    let minutes = parseInt(time / 60);
    let seconds = parseInt(time - (minutes * 60));

    if (minutes < 10)
      minutes = "0" + minutes;

    if (seconds < 10)
      seconds = "0" + seconds;

    return minutes + ":" + seconds;
  }

  createPlayersStatus(players){
    if(Array.isArray(players) && players.length > 0){
      return players.map(player => <div key={"main-statistics-player" + player.name} className="player-status-row">
        <div key={"main-statistics-player-name" + player.name} className="player-name">{player.name}</div>
        <div key={"main-statistics-player-status" + player.name} className="player-status">{player.isActive ? 'Playing' : 'Finished' }</div>
      </div>)
    }

    return [];

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
          <div className="players-status">
            <div className="players-status-title">Players:</div>
            {this.createPlayersStatus(this.props.players)}
          </div>
        </div>
    </div>
    );
  }
}
export default DominoStatistics;