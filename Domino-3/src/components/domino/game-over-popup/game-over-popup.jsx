import React, {Component} from "react";
import "./game-over-popup.css";

class GameOverPopup extends Component {
    constructor() {
        super();
        this.showStatistics = this.showStatistics.bind(this);
    }

    render() {
        return (
            <div className={"popup-message " + (this.props.showPopup ? "show-popup" : "")}>
                <h1>Game Over</h1>
                <div className="popup-text">{this.props.gameOverMessage}</div>
                {this.showStatistics(this.props.playersData)}
                <button className="my-button" onClick={this.props.closeFunction} disabled={!this.props.canCloseAndWatch}>Close and Watch</button>
                <button className="my-button" onClick={this.props.leaveGameFunction}>Leave Game</button>
            </div>
        );
    }

    showStatistics(playersData) {
        if(Array.isArray(playersData)){
            return playersData.map(playerData =>
            <div key={"gameover-statistics-player" + playerData.name} className="player">
            {'Player ' + playerData.name + ':'}
                <div key={"gameover-statistics-player-data" + playerData.name} className="player-data">
                    <div key={"gameover-statistics-player-score" + playerData.name} className="player-score">{playerData.score + ' points'}</div>
                    <div key={"gameover-statistics-player-position" + playerData.name} className="player-position">{'#' + playerData.position}</div>
                </div>
            </div>
            )
        }
    }
}

export default GameOverPopup;