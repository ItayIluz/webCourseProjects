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
                    key={"tile-first"+tilesData[i].firstDots+"second"+tilesData[i].secondDots} 
                    inHand={true} 
                    firstDots={tilesData[i].firstDots} 
                    secondDots={tilesData[i].secondDots}
                    onClick={() => this.placeOnBoard(this)}
                  />);
    }

    this.setState({renderedTiles: tiles});
  }

  placeOnBoard(tile){
    let currentRenderedTiles = this.state.renderedTiles;
    let index = currentRenderedTiles.findIndex(a => tile.firstDots == a.firstDots && tile.secondDots == a.secondDots);

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