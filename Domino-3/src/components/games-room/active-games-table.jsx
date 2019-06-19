import React, { Component } from 'react';

class ActiveGamesTable extends Component {

  constructor(){
    super();
  }

  // Populate the table with data based on the received data from the parent component
  createTable() {
    let table = []
    let gamesData = this.props.gamesData;
    
    for (let i = 0; i < gamesData.length; i++) {
        let children = []
  
        children.push(<td key={gamesData[i].title+"-"+"title"}>{gamesData[i].title}</td>)
        children.push(<td key={gamesData[i].title+"-"+"createdBy"}>{gamesData[i].createdBy}</td>)
        children.push(<td key={gamesData[i].title+"-"+"numOfPlayers"}>{gamesData[i].numOfPlayers}</td>)
        children.push(<td key={gamesData[i].title+"-"+"playersInGame"}>{gamesData[i].playersInGame}</td>)
        children.push(<td key={gamesData[i].title+"-"+"status"}>{gamesData[i].status}</td>)
        children.push(<td key={gamesData[i].title+"-"+"joinGameButton"}>
          <button className="my-button" onClick={() => this.props.handleJoinGame(gamesData[i].title)} disabled={gamesData[i].status !== "Pending"}>Join Game</button></td>);
          children.push(<td key={gamesData[i].title+"-"+"deleteGameButton"}>
          <button 
            className="my-button" 
            onClick={() => this.props.handleDeleteGame(gamesData[i].title)} 
            disabled={this.props.currentUser.name !== gamesData[i].createdBy || gamesData[i].status !== "Pending" || gamesData[i].playersInGame !== 0}>
              Delete Game
          </button></td>);

        table.push(<tr key={"game-row-"+gamesData[i].title} >{children}</tr>)
    }
    return table;
  }

  render() {
    return (
      <div className={"table-container" + (this.props.hidden ? " hidden" : "")}>
          {
            this.props.gamesData.length !== 0 ? 
            <div>
              <table className="my-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Created By</th>
                    <th>Number Of Players Needed</th>
                    <th>Players In-Game</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.createTable()}
                </tbody>
              </table>
            </div> : 
            <div style={{margin: "0px 20px"}}>There are currently no active games available.</div>
          }
      </div>
    );
  }
}

export default ActiveGamesTable; 
