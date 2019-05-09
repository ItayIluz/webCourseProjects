import React, { Component } from "react";
import "./domino-tile.css";

class DominoTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPoints: props.firstPoints,
      secondPoints: props.secondPoints
    };
  }

  render() {
    return (
      <div className="domino-tile vertical">
        <div className="tile-dots-container">
          <div className="tile-dot"></div>
          <div className="tile-dot"></div>
          <div className="tile-dot"></div>
        </div>
        <div className="tile-break" />
        <div className="tile-dots-container">
          <div className="tile-dot"></div>
          <div className="tile-dot"></div>
        </div>
      </div>
    );
  }
}
export default DominoTile;