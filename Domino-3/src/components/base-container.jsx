import React, { Component } from "react";
import SignUpPage from './sign-up-page/sign-up-page.jsx';
import GamesRoom from './games-room/games-room.jsx';
import DominoGame from './domino/domino-game/domino-game.jsx';

export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            connectedSuccessfully: false,
            currentGameTitle: null,
            currentUser: {
                name: null
            }
        };
        
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.handleLogout= this.handleLogout.bind(this);
        this.handleJoinGame= this.handleJoinGame.bind(this);
        this.handleLeaveGame= this.handleLeaveGame.bind(this);

        this.getUserName();
    }
    
    render() {        
        if (!this.state.connectedSuccessfully) {
            return (<SignUpPage loginSuccessHandler={this.handleSuccessedLogin}/>);
        } else if(this.state.currentGameTitle === null){
            return (<GamesRoom currentUser={this.state.currentUser} handleJoinGame={this.handleJoinGame} handleLogout={this.handleLogout}/>);
        } else {
            return (<DominoGame gameTitle={this.state.currentGameTitle} currentUser={this.state.currentUser} handleLeaveGame={this.handleLeaveGame}/>)
        }
    }

    handleSuccessedLogin() {
        this.setState(()=>({connectedSuccessfully:true}), this.getUserName);        
    }

    handleLeaveGame(){
        fetch('/games/playerLeaveGame', {method: 'POST', body: this.state.currentGameTitle, credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`Failed to leave game ${this.state.currentGameTitle} `, response);                
            } else {
                this.setState({currentGameTitle: null});
            }
        });
    }

    handleJoinGame(gameTitle){
        fetch('/games/playerJoinGame', {method: 'POST', body: gameTitle, credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`Failed to join game ${gameTitle} `, response);                
            } else {
                this.setState({currentGameTitle: gameTitle});
            }
        });
    }

    getUserName() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser: userInfo, connectedSuccessfully: true}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({connectedSuccessfully: false}));
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                console.log("Unauthorized");
            }
            return response.json();
        });
    }

    handleLogout() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }
            this.setState(()=>({currentUser: {name: null}, connectedSuccessfully: false}));
        });
    }
}