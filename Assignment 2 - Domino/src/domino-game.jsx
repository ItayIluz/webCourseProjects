import React, { Component } from "react";
import DominoTile from "./domino-tile.jsx";
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
        <DominoTile firstPoints="1" secondPoints="2"/>
      </div>
    );
  }
}
export default DominoGame;