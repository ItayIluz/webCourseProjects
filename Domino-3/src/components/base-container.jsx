import React, { Component } from "react";
import SignUpPage from './sign-up-page/sign-up-page.jsx';
import GamesRoom from './games-room/games-room.jsx';

export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            connectedSuccessfully: false,
            currentUser: {
                name: ''
            }
        };
        
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);

        this.getUserName();
    }
    
    render() {        
        if (!this.state.connectedSuccessfully) {
            return (<SignUpPage loginSuccessHandler={this.handleSuccessedLogin}/>)
        } else {
            return (<GamesRoom currentUser={this.state.currentUser} logoutHandler={this.logoutHandler}/>)
        } /* else {
            return (<DominoGame currentUser={this.state.currentUser}/>)
        } */
    }

    handleSuccessedLogin() {
        this.setState(()=>({connectedSuccessfully:true}), this.getUserName);        
    }

    getUserName() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser: userInfo, connectedSuccessfully: true}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({connectedSuccessfully: false}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }

    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }
            this.setState(()=>({currentUser: {name:''}, connectedSuccessfully: false}));
        });
    }
}