import React, { Component } from "react";
import DominoTile from "./domino-tile.jsx"
import "./domino-board.css";

class DominoBoard extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }
  render() {
    return (
      <div>
        <p>Hello worlf from react 16 </p>
      </div>
    );
  }
}
export default DominoBoard;