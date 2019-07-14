import React, { Component } from 'react';
import ActiveGamesTable from './active-games-table.jsx';
import ActivePlayersTable from './active-players-table.jsx';
import AddNewGameDialog from './add-new-game-dialog.jsx';
import './games-room.css';


const SERVLET_URL = "gamesRoom";

class GamesRoom extends Component {

  constructor(props){
    super(props);
    
    this.state = {
      activeGames: [],
      activePlayers: [],
      joinedGame: false,
      joinedGameTitle: null,
      showAddNewGameDialog: false,
    }
    
    this.getGamesData = this.getGamesData.bind(this);
    this.getUsersData = this.getUsersData.bind(this);
    this.handleAddNewGame = this.handleAddNewGame.bind(this);
    this.handleDeleteGame = this.handleDeleteGame.bind(this);
    this.closeAddNewGameDialog = this.closeAddNewGameDialog.bind(this);    
  }

  componentDidMount() {
    this.getGamesData();
    this.getUsersData();
  }

  componentWillUnmount() {
    if (this.gamesTimeoutId) {
      clearTimeout(this.gamesTimeoutId);
    }
    if (this.usersTimeoutId) {
      clearTimeout(this.usersTimeoutId);
    }
  }

  handleDeleteGame(gameTitle){
    fetch('/games/deleteGame', {method: 'POST', body: gameTitle, credentials: 'include'})
      .then(response => {
          if (!response.ok) {
              console.log(`failed to delete game ${gameTitle} `, response);                
          }
      });
  }

  handleAddNewGame(){
    this.setState({showAddNewGameDialog: true});
  }

  closeAddNewGameDialog(event) {
    if(event)
      event.preventDefault();

    this.setState({
      showAddNewGameDialog: false
    });
  }

  getGamesData() {
      return fetch('/games', {method: 'GET', credentials: 'include'})
      .then((response) => {
          if (!response.ok){
              console.log(response);
          }
          this.gamesTimeoutId = setTimeout(this.getGamesData, 200);
          return response.json();            
      })
      .then(gamesData => {
          this.setState({activeGames: gamesData});
      })
      .catch(err => {console.log(err)});
  }

  getUsersData() {
      return fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
      .then((response) => {
          if (!response.ok){
            console.log(response);
          }
          this.usersTimeoutId = setTimeout(this.getUsersData, 200);
          return response.json();            
      })
      .then(usersData => {
          this.setState({activePlayers: usersData});
      })
      .catch(err => {console.log(err)});
  }

  render() {
    return (
      <div className="main">
        <div className="main-header">
          Games Room
        </div>
        <div className="buttons-container">
          <span><b>Logged in as <u>{this.props.currentUser.name}</u></b></span>
          <button className="my-button" onClick={this.handleAddNewGame}>Add a New Game</button>
          <button className="my-button" onClick={this.props.handleLogout}>Logout</button>
        </div>
        <div className="tables-container">
          <div className="container-header">
          <div className="container-header-title">Active Games</div>
            <div className="container">
              <ActiveGamesTable 
                currentUser={this.props.currentUser}
                gamesData={this.state.activeGames}
                handleJoinGame={this.props.handleJoinGame}
                handleDeleteGame={this.handleDeleteGame}
              />
            </div>
          </div>
          
          <div className="container-header">
            <div className="container-header-title">Active Players</div>
            <div className="container">
              <ActivePlayersTable playersData={this.state.activePlayers}/>
            </div>
          </div>
        </div>
        <div hidden={!this.state.showAddNewGameDialog} className="dialog-overlay">
            <AddNewGameDialog 
              closeFunction={this.closeAddNewGameDialog}
            />
        </div>
      </div>
    );
  }
}

export default GamesRoom; 
