import React, { Component } from "react";
import "./sign-up-page.css";

class SignUpPage extends Component {
  
  constructor() {
    super();

    this.state = {
      inputResult: "",
      messageTimeoutID: -1,
    }

    this.playerUsernameInput = React.createRef();
    this.handleSignUp = this.handleSignUp.bind(this);
    this.updateInputResultMessage = this.updateInputResultMessage.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
  }
  
  // Validate and send data to server and show a message based on the results
  handleSignUp(event) {
    event.preventDefault();

    const userInput = this.playerUsernameInput.current.value.trim();

    if(userInput == ""){
      this.updateInputResultMessage("Please enter your player name!");
    } else {
      fetch('/users/addUser', {method:'POST', body: userInput, credentials: 'include'})
      .then(response => {            
          if (response.ok){
            this.props.loginSuccessHandler();
          } else {
              if (response.status === 403) {
                this.updateInputResultMessage("User name already exist, please try another one");
              }
          }
      });
      return false;
    }
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

  // Update the submit result and hide it after 3 seconds
  updateInputResultMessage(message){
    this.setState({inputResult: message});
    if(this.state.messageTimeoutID !== -1)
      clearTimeout(this.state.messageTimeoutID);

    let messageTimeout = setTimeout(() => this.setState({inputResult: "", messageTimeoutID: -1}), 3000);
    this.setState({messageTimeoutID: messageTimeout});
  }

  render() {

    return (
      <div className="main">
        <div className="main-header">
          Welcome to the Domino Online Game!
        </div>
        <div className="container-header" style={{  width: "485px", margin: "20px auto"}}>
          <div className="container-header-title">Please sign up in order to play</div>
          <div className="container">
            <form className="sign-up-form">
              <div className="form-field-container">
                <label htmlFor="form-player-username-input">Your Player Name:</label>
                  <input id="form-player-username-input" ref={this.playerUsernameInput} name="playerUserName" type="text" className="form-field-input" />
              </div>
                <button className="my-button" onClick={this.handleSignUp}>Login</button>
              <div className={"input-result" + (this.state.inputResult === "" ? " hidden" : "")}>
                {this.state.inputResult}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default SignUpPage;