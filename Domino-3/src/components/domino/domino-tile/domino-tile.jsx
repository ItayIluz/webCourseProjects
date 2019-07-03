import React, {Component} from "react";
import "./domino-tile.css";
import TileNumber from "../tile-number/tile-number.jsx";
import TilePosition from "../tile-position/tile-position.jsx";

class DominoTile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
            inHand: this.props.inHand,
            factor: this.props.factor,
            position: {
                x: this.props.position.x,
                y: this.props.position.y,
                spin: this.props.position.spin
            }
        };

        this.handleClick = this.handleClick.bind(this);
        this.transform = this.transform.bind(this);
        this.getAnimationClassName = this.getAnimationClassName.bind(this);
        this.toggleSelect = this.toggleSelect.bind(this);
    }

    
    handleClick() {
        if(this.state.inHand){
            this.toggleSelect(this.props.selectTile(this));
        }
    }

    toggleSelect(select) {
        this.setState({isSelected: select});
    }

    transform() {
        return {transform: `translate(${50 * this.props.position.x}%,${25 * this.props.position.y}%) rotate(${this.props.position.spin * 90}deg)`};
    }


    getAnimationClassName(){
        if(!this.props.animation || this.props.animation.none){
            return '';
        }
        else if(this.props.animation.inHand){
            return 'anim-in-hand';
        }
        else if(this.props.animation.onBoard){
            return 'anim-on-board';
        }
    }


    render() {
        return (
            <div
                className={"tile-container" + (this.props.inHand ? " in-hand" : " on-board") + (this.state.isSelected ? " selected" : "") + ' ' + this.getAnimationClassName()}>
                <div
                    style={this.transform()}
                    className={"domino-tile"}
                    onClick={this.handleClick}>
                    <TileNumber number={this.props.numA}/>
                    <div className="tile-break"/>
                    <TileNumber number={this.props.numB}/>
                </div>
            </div>
        );
    }
}

export default DominoTile;
