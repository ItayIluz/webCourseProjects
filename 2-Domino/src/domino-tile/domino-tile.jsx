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
            possibleAdjacentTiles: this.calculatePossibleAdjacentTiles(this.props.position, this.props.numA, this.props.numB, this.props.fatherPosition),
            fatherTile: this.props.fatherTile,
            position: {
                x: this.props.position.x,
                y: this.props.position.y,
                spin: this.props.position.spin
            }
        };

        this.placeSelectedTileAndUpdatePositions = this.placeSelectedTileAndUpdatePositions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.transform = this.transform.bind(this);
        this.isDouble = this.isDouble.bind(this);
        this.isVertical = this.isVertical.bind(this);
        this.getRegularAdjacent = this.getRegularAdjacent.bind(this);
        this.getDoubleAdjacent = this.getDoubleAdjacent.bind(this);
        this.getAdjacentOfDouble = this.getAdjacentOfDouble.bind(this);
        this.filterPositions = this.filterPositions.bind(this);
        this.createTilePositions = this.createTilePositions.bind(this);
    }

    calculatePossibleAdjacentTiles(position, numA, numB, takenPosition) {
        if (this.props.inHand) {
            return [];
        }
        let tilePositions = this.getRegularAdjacent(position, numA, numB);
        if (numA === numB) {
            tilePositions = tilePositions.concat(this.getAdjacentOfDouble(position, numA, numB));
        } else {
            tilePositions = tilePositions.concat(this.getDoubleAdjacent(position, numA, numB));
        }
        if (!!takenPosition) {
            tilePositions = this.filterPositions(tilePositions, takenPosition);
        }

        this.props.updateTilePositions(tilePositions, `[${this.props.numA},${this.props.numB}]`);
        return tilePositions;
    }


    getAdjacentOfDouble(position, numA, numB) {
        position.spin = position.spin % 4;
        return [1, -1].map(i => {
            if (this.isVertical(position)) {
                return {
                    requiredNum: numA,
                    doubleRequired: false,
                    position: {
                        x: position.x + i * 3,
                        y: position.y,
                        spin: (4 - i) % 4
                    }
                }
            } else {
                return {
                    requiredNum: numA,
                    doubleRequired: false,
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
        position.spin = position.spin % 4;
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
                    doubleRequired: true,
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
                    doubleRequired: true,
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
        position.spin = position.spin % 4;
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
                    doubleRequired: false,
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
                    doubleRequired: false,
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
        return position.spin % 2 === 0;
    }

    handleClick() {
        this.setState({isSelected: !this.state.isSelected});
        this.props.onClick(this);
    }

    transform() {
        return {transform: `translate(${50 * this.props.position.x}%,${25 * this.props.position.y}%) rotate(${this.props.position.spin * 90}deg)`};
    }

    placeSelectedTileAndUpdatePositions(tilePosition) {
        this.props.placeSelectedTile(tilePosition, this.props.position, () => {
            let possibleAdjacentTiles = this.filterPositions(this.state.possibleAdjacentTiles, tilePosition.position);
            this.setState({possibleAdjacentTiles: possibleAdjacentTiles});
            this.props.updateTilePositions(possibleAdjacentTiles, `[${this.props.numA},${this.props.numB}]`);
        })
    }

    filterPositions(tilePositions, takenPosition) {
        tilePositions = tilePositions.filter(tilePosition => {
            if (takenPosition.x === tilePosition.position.x && Math.abs(takenPosition.y - tilePosition.position.y) <= 1) {
                console.log('filtered', this.props.numA, this.props.numB);
                return false;
            }
            if (takenPosition.y === tilePosition.position.y && Math.abs(takenPosition.x - tilePosition.position.x) <= 1) {
                console.log('filtered', this.props.numA, this.props.numB);
                return false;
            }
            return true;
        });
        return tilePositions;
    }

    createTilePositions() {
        return this.state.possibleAdjacentTiles.map(tp => (
            <TilePosition key={`${tp.requiredNum}_${tp.position.x}_${tp.position.y}_${tp.position.spin}`}
                          tilePosition={tp}
                          parentTilePosition={this.props.position}
                          placeSelectedTile={this.placeSelectedTileAndUpdatePositions}
            />))
    }

    render() {
        return (
            <div
                className={"tile-container" + (this.props.inHand ? " in-hand" : " on-board") + (this.state.isSelected ? " selected" : "")}>
                <div
                    style={this.transform()}
                    className={"domino-tile"}
                    onClick={this.handleClick}>
                    <TileNumber number={this.props.numA}/>
                    <div className="tile-break"/>
                    <TileNumber number={this.props.numB}/>
                </div>
                {this.createTilePositions()}
            </div>
        );
    }
}

export default DominoTile;
