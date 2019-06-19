import React, {Component} from "react";
import "./tile-position.css";

class TilePosition extends Component {
    constructor(props) {
        super(props);
        this.myPosition = {
            x: this.props.tilePosition.position.x,
            y: this.props.tilePosition.position.y,
            spin: this.props.tilePosition.position.spin

        };

        this.transform = this.transform.bind(this);
        this.place = this.place.bind(this);

    }

    transform() {
        return {transform: `translate(${50 * this.myPosition.x}%,${25 * this.myPosition.y}%) rotate(${this.myPosition.spin * 90}deg)`};
    }

    place(){
        this.props.placeSelectedTile(this.props.tilePosition);
    }


    render() {
        return (
            <div className={"tile-position"} style={this.transform()} onClick={this.place}>

            </div>
        );
    }

}

export default TilePosition;