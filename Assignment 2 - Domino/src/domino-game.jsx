import React, { Component } from "react";
import DominoBoard from "./domino-board.jsx";
import DominoHeader from "./domino-header.jsx";
import "./domino-game.css";

class DominoGame extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }
  render() {
    return (
      <div>
        <DominoHeader></DominoHeader>
        <DominoBoard></DominoBoard>
      </div>
    );
  }
}
export default DominoGame;