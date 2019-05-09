import React, { Component } from "react";
import "./domino-tile.css";

class DominoTile extends Component {
  constructor(props) {
    super(props);
  }

  createDotsContainer(numberOfDots){
    let container = [];
      
    for(let line = 1; line <= 3; line++){
      let lineDots = [];

      if(line == 1) {

          if(numberOfDots > 1)
            lineDots.push(<div key={"line-1-dot-1-of-3"} className="tile-dot black"></div>);
          else
            lineDots.push(<div key={"line-1-dot-1-of-3"} className="tile-dot white"></div>);
          
          lineDots.push(<div key={"line-1-dot-2-of-3"} className="tile-dot white"></div>);
          
          if(numberOfDots > 3)
            lineDots.push(<div key={"line-1-dot-3-of-3"} className="tile-dot black"></div>);
          else
            lineDots.push(<div key={"line-1-dot-3-of-3"} className="tile-dot white"></div>);

      } else if(line == 2) {

        if(numberOfDots == 6)
          lineDots.push(<div key={"line-2-dot-1-of-3"} className="tile-dot black"></div>); 
        else
          lineDots.push(<div key={"line-2-dot-1-of-3"} className="tile-dot white"></div>);

        if(numberOfDots % 2 != 0)
          lineDots.push(<div key={"line-2-dot-2-of-3"} className="tile-dot black"></div>);
        else
          lineDots.push(<div key={"line-2-dot-2-of-3"} className="tile-dot white"></div>);

        if(numberOfDots == 6)
          lineDots.push(<div key={"line-2-dot-3-of-3"} className="tile-dot black"></div>);
        else
          lineDots.push(<div key={"line-2-dot-3-of-3"} className="tile-dot white"></div>);

      } else if(line == 3){

        if(numberOfDots < 4)
          lineDots.push(<div key={"line-3-dot-1-of-3"} className="tile-dot white"></div>);
        else
          lineDots.push(<div key={"line-3-dot-1-of-3"} className="tile-dot black"></div>);
          
        lineDots.push(<div key={"line-3-dot-2-of-3"} className="tile-dot white"></div>);
        
        if(numberOfDots > 1)
          lineDots.push(<div key={"line-3-dot-3-of-3"} className="tile-dot black"></div>);
        else
          lineDots.push(<div key={"line-3-dot-3-of-3"} className="tile-dot white"></div>);
      }

      container.push(<div key={"line"+line} className={"tile-dots-container-line " + "line"+line}>{lineDots}</div>);
    }

      

    /*  for (let i = 1; i < numberOfDots; i++) {


        container.push(<div key={"dot-"+i+"-of-"+numberOfDots} className="tile-dot"></div>)
      }*/
      return container;
  }

  render() {
    return (
      <div className="domino-tile">
        <div className="tile-dots-container">
          {this.createDotsContainer(this.props.firstDots)}
        </div>
        <div className="tile-break" />
        <div className="tile-dots-container">
          {this.createDotsContainer(this.props.secondDots)}
        </div>
      </div>
    );
  }
}
export default DominoTile;