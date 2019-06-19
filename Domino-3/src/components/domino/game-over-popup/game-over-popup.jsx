import React, {Component} from "react";
import "./game-over-popup.css";

class GameOverPopup extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className={"popup-message " + (this.props.showPopup ? "show-popup" : "")}>
                <h1>Game Over</h1>
                <div className="popup-text">{this.props.gameOverMessage}</div>
                <div className="button-container">
                    <button className="button" onClick={this.props.closeFunction}>Close</button>
                    <button className="button" onClick={this.props.startNewGameFunction}>Start a New Game</button>
                    <button className="button" onClick={this.props.enableReplayFunction}>Replay</button>
                </div>
            </div>
        );
    }
}

export default GameOverPopup;