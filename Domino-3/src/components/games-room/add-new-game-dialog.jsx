import React, { Component } from 'react';

class AddNewGameDialog extends Component {

  constructor(props){
    super(props);

    this.state = {
      inputResult: "",
      messageTimeoutID: -1,
    }

    this.gameTitle = React.createRef();
    this.gameNumOfPlayers = React.createRef();
    this.updateInputResultMessage = this.updateInputResultMessage.bind(this);
    this.handleAddGame = this.handleAddGame.bind(this);
  }

  // Update the submit result and hide it after 3 seconds
  updateInputResultMessage(message){
    this.setState({inputResult: message});
    if(this.state.messageTimeoutID !== -1)
      clearTimeout(this.state.messageTimeoutID);

    let messageTimeout = setTimeout(() => this.setState({inputResult: "", messageTimeoutID: -1}), 3000);
    this.setState({messageTimeoutID: messageTimeout});
  }

  // Validate and send data to server and show a message based on the results
  handleAddGame(event) {
    event.preventDefault();

    const gameTitleInput = this.gameTitle.current.value.trim();
    const gameNumOfPlayersInput = this.gameNumOfPlayers.current.value.trim();

    if(gameTitleInput === "" || gameNumOfPlayersInput === ""){
      this.updateInputResultMessage("Please fill all the fields.");
    } else {
      let numbersOfPlayers = parseInt(gameNumOfPlayersInput) || 0;
      if(numbersOfPlayers < 2 || numbersOfPlayers > 3)
        this.updateInputResultMessage("Number of players must be between 2-3.");
      else {
        fetch('/games', {
          method: 'POST',
          body: JSON.stringify({
            title: gameTitleInput,
            numOfPlayers: numbersOfPlayers
          }),
          credentials: 'include'
        })
        .then(response => {            
            if (!response.ok) {                
                console.log(response);
                this.updateInputResultMessage("User name already exist, please try another one");
            } else {
              this.props.closeFunction();
            }
        });
        return false;
      }
    }
  }

  render() {
    return (
      <div className="dialog-modal">
        <div className="container-header dialog-header">
          <div className="container-header-title">Add a New Game</div>
          <div className="container dialog-container">
            <form className="sign-up-form">
              <div className="form-field-container">
                <label htmlFor="form-game-title-input">Game Title:</label>
                  <input id="form-game-title-input" ref={this.gameTitle} name="gameTitle" type="text" className="form-field-input" />
              </div>
              <div className="form-field-container">
                <label htmlFor="form-num-of-players-input">Number Of Players:</label>
                  <input id="form-num-of-players-input" ref={this.gameNumOfPlayers} name="gameNumOfPlayers" type="number" min="2" max="3" className="form-field-input" />
              </div>
                <button className="my-button dialog-button" onClick={this.handleAddGame}>Add Game</button>
                <button className="my-button dialog-button" onClick={this.props.closeFunction}>Cancel</button>
              <div style={{marginTop: "10px"}} className={"input-result" + (this.state.inputResult === "" ? " hidden" : "")}>
                {this.state.inputResult}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddNewGameDialog; 