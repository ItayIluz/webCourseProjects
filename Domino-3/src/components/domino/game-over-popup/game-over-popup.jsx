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
                <button className="my-button" onClick={this.props.closeFunction}>Close</button>
            </div>
        );
    }

    showStatistics(playersData) {
        if(Array.isArray(playersData)){
            return playersData.map(playerData =>
            <div className="player">
            {'Player ' + playerData.name + ':'}
                <div className="player-data">
                    <div className="player-score">{playerData.score + ' points'}</div>
                    <div className="player-position">{'#' + playerData.position}</div>
                </div>
            </div>
            )
        }
    }
}

export default GameOverPopup;