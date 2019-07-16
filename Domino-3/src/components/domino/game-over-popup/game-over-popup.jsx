import React, {Component} from "react";
import "./game-over-popup.css";

class GameOverPopup extends Component {
    constructor() {
        super();
        this.showStatistics = this.showStatistics.bind(this);
    }

    render() {
        return (
            <div className="dialog-modal">
                <div className="container-header dialog-header">
                <div className="container-header-title">Game Over</div>
                    <div className="container dialog-container">
                        <div style={{margin: "0px 20px", padding: "5px"}}>
                            {this.showStatistics(this.props.playersData)}
                        </div>
                        <div className="dialog-button-panel">
                            <button className="my-button dialog-button" onClick={this.props.closeFunction} disabled={!this.props.canCloseAndWatch}>Close and Watch</button>
                            <button className="my-button dialog-button" onClick={this.props.leaveGameFunction}>Leave Game</button>
                        </div>
                    </div>
                </div>
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