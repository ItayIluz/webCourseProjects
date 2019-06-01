import React, { Component } from "react";
import "./game-over-popup.css";

class GameOverPopup extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={"popup-message " + (this.props.showPopup ? "show-popup" : "")}>
        <h1>Game Over</h1>
        <div className="popup-text">this is the message</div>
        <button className="button" onClick={this.props.closeFunction}>OK</button>
    </div>
    );
  }
}
export default GameOverPopup;