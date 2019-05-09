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
        <DominoTile firstDots="1" secondDots="6"/>
        <div>abc</div>
        <DominoTile firstDots="2" secondDots="5"/>
        <div>abc</div>
        <DominoTile firstDots="3" secondDots="4"/>
      </div>
    );
  }
}
export default DominoGame;