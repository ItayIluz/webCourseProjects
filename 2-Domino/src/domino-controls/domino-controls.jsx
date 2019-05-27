/*import React, { Component } from "react";
import "./domino-controls.css";
import DominoTile from "./domino-tile.jsx";

class DominoControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedTiles: []
    };

    this.renderPlayerHand = this.renderPlayerHand.bind(this);
  }

  componentDidMount(){
    this.renderPlayerHand(); 
  }

  renderPlayerHand(){
    let tiles = this.state.renderedTiles;
    let tilesData = this.props.playerHand;
    
    for (let i = 0; i < tilesData.length; i++) {
      tiles.push(<DominoTile 
                    key={"tile-first"+tilesData[i].numA+"second"+tilesData[i].numB}
                    inHand={true} 
                    numA={tilesData[i].numA}
                    numB={tilesData[i].numB}
                    onClick={() => this.placeOnBoard(this)}
                  />);
    }

    this.setState({renderedTiles: tiles});
  }

  placeOnBoard(tile){
    let currentRenderedTiles = this.state.renderedTiles;
    let index = currentRenderedTiles.findIndex(a => tile.numA == a.numA && tile.numB == a.numB);

    if (index > -1) {
      currentRenderedTiles.splice(index, 1);
    }
    this.props.tileToAddFunc(tile);
    this.setState({renderedTiles: currentRenderedTiles});
  }

  

  render() {
    return (
    
    );
  }
}
export default DominoControls;*/