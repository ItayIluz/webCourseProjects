import React, {Component} from "react";
import "./tile-position.css";

class TilePosition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTaken: this.props.tilePosition.isTaken
        }
    }

    transform() {
        return {transform: `translate(${50 * this.props.tilePosition.position.x}%,${25 * this.props.tilePosition.position.y}%) rotate(${this.props.tilePosition.position.spin * 90}deg)`};
    }


    render() {
        return (
            <div className={'tile-position ' + this.state.isTaken ? 'taken ' : ''} style={this.transform()}>

            </div>
        );
    }

    onClick(){

    }
}

export default TilePosition;