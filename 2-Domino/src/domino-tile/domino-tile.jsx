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
            possibleAdjacentTiles: this.findPossibleAdjacentTilesIfNeeded(this.props.possibleAdjacentTiles),
            fatherTile: this.props.fatherTile,
            position: {
                x: this.props.position.x,
                y: this.props.position.y,
                spin: this.props.position.spin
            }
        };

        this.handleClick = this.handleClick.bind(this);
        this.transform = this.transform.bind(this);
        this.isDouble = this.isDouble.bind(this);
        this.isVertical = this.isVertical.bind(this);
        this.getRegularAdjacent = this.getRegularAdjacent.bind(this);
        this.getDoubleAdjacent = this.getDoubleAdjacent.bind(this);
        this.getAdjacentOfDouble = this.getAdjacentOfDouble.bind(this);
        this.findPossibleAdjacentTilesIfNeeded = this.findPossibleAdjacentTilesIfNeeded.bind(this);
        this.createTilePositionsComp = this.createTilePositionsComp.bind(this);
    }

    findPossibleAdjacentTilesIfNeeded(possibleAdjacentTilesProp){
        if(this.props.inHand){
            return [];
        }
        else if(!!possibleAdjacentTilesProp){
            return possibleAdjacentTilesProp;
        }
        else{
            console.log(this.calculatePossibleAdjacentTiles(this.props.position, this.props.numA, this.props.numB));
            return this.calculatePossibleAdjacentTiles(this.props.position, this.props.numA, this.props.numB);
        }
    }

    calculatePossibleAdjacentTiles(position, numA, numB, takenPosition) {
        let tiles = this.getRegularAdjacent(position, numA, numB);
        if (numA === numB) {
            tiles = tiles.concat(this.getAdjacentOfDouble(position, numA, numB));
        } else {
            tiles = tiles.concat(this.getDoubleAdjacent(position, numA, numB));
        }
        if(!!takenPosition){
            tiles.forEach(tile => {
                if(tile.position.x === takenPosition.x && tile.position.y === takenPosition.y){
                    tile.isTaken = true;
                }
            })
        }
        return tiles;
    }


    getAdjacentOfDouble(position, numA, numB) {
        return [1, -1].map(i => {
            if (this.isVertical(position)) {
                return {
                    requiredNum: numA,
                    isDoubleRequired: false,
                    isTaken: false,
                    position: {
                        x: position.x + i * 3,
                        y: position.y,
                        spin: (4 - i) % 4
                    }
                }
            } else {
                return {
                    requiredNum: numA,
                    isDoubleRequired: false,
                    isTaken: false,
                    position: {
                        x: position.x,
                        y: position.y + i * 3,
                        spin: (1 - i)
                    }
                }
            }
        })
    }

    getDoubleAdjacent(position, numA, numB) {
        return [1, -1].map(i => {
            if (this.isVertical(position)) {
                let num;
                if (position.spin === 0) {
                    num = i === 1 ? numA : numB;
                } else {
                    num = i === -1 ? numA : numB;
                }
                return {
                    requiredNum: num,
                    isDoubleRequired: true,
                    isTaken: false,
                    position: {
                        x: position.x,
                        y: position.y + i * 3,
                        spin: 1
                    }
                }
            } else {
                let num;
                if (position.spin === 1) {
                    num = i === 1 ? numA : numB;
                } else {
                    num = i === -1 ? numA : numB;
                }
                return {
                    requiredNum: num,
                    isDoubleRequired: true,
                    isTaken: false,
                    position: {
                        x: position.x + i * 3,
                        y: position.y,
                        spin: 0
                    }
                }
            }
        })
    }

    getRegularAdjacent(position, numA, numB) {
        return [1, -1].map(i => {
            if (this.isVertical(position)) {
                let num;
                if (position.spin === 0) {
                    num = i === 1 ? numB : numA;
                } else {
                    num = i === -1 ? numB : numA;
                }
                return {
                    requiredNum: num,
                    isDoubleRequired: false,
                    isTaken: false,
                    position: {
                        x: position.x,
                        y: position.y + i * 4,
                        spin: 1 - i
                    }
                }
            } else {
                let num;
                if (position.spin === 1) {
                    num = i === 1 ? numA : numB;
                } else {
                    num = i === -1 ? numA : numB;
                }
                return {
                    requiredNum: num,
                    isDoubleRequired: false,
                    isTaken: false,
                    position: {
                        x: position.x + i * 4,
                        y: position.y,
                        spin: 2 + i
                    }
                }
            }
        })
    }

    isDouble(numA, numB) {
        return numA === numB;
    }

    isVertical(position) {
        return position.spin === 0 || position.spin === 2;
    }

    handleClick() {
        this.setState({isSelected: !this.state.isSelected});
        this.props.onClick(this);
    }

    transform() {
        return {transform: `translate(${50 * this.props.position.x}%,${25 * this.props.position.y}%) rotate(${this.props.position.spin * 90})`};
    }

    createTilePositionsComp(){
        return this.state.possibleAdjacentTiles.map(tp => (<TilePosition key={`${tp.requiredNum}_${tp.position.x}_${tp.position.y}_${tp.position.spin}` } tilePosition={tp}/>))
    }

    render() {
        return (
            <div
                style={this.transform()}
                className={"domino-tile" + (this.props.inHand ? " in-hand" : " on-board") + (this.state.isSelected ? " selected" : "")}
                onClick={this.handleClick}>
                <TileNumber number={this.props.numB}/>
                <div className="tile-break"/>
                <TileNumber number={this.props.numA}/>
                {this.createTilePositionsComp()}
            </div>
        );
    }
}

export default DominoTile;
