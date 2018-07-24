import React, { Component } from 'react';
import CreateChar from './createChar.js';
import PlayerCard from './components/PlayerCard/PlayerCard.js'
import Card from './components/Card/Card.js'
import characterTable from './components/characterTable'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'home',
      selectedChar: {},
      character1: {},
      character2: {},
      response: [],
      turn: 0
    }
  }

  componentDidMount() {
    this.getChars();
  }

  dndFetch = async (urlAppend, method, body) => {
    let options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'MEDQ5xp/hAlwDei/yjIB2AlB38LRfEoVw9l40ge7tVO812AJ1oBn1wF7sAX9/uqN04K0hIbclbI//FIrFQrg6uWZk75yFI6LGO3sQ7EgOJAuBWuFFQfvKf8ZxBoRif3BvNPx3au68NAhH/UdP0jMqCOZ3Dnkp0DpaNpYUwS1nM8vNeC6l96tt8f0e0GW/3UtSaBg4PzK5SU8FTlXLCyL+YpObBmdrirCb5VsWy1nAbLkFESaVXEmwKOSB59kd'
      },
    }
    if (body) {
      options.body = body
    }
    const fetchedItem = await fetch(`https://www.momentoftop.com/dnd/v0/${urlAppend}`, options);
    return await fetchedItem.json();  
  }

  getChars = async (page = 0, allCharsNames = []) => {
    const charsNames = await this.dndFetch (`characters?page=${page}`, 'GET');
    if (charsNames.length !== 0) {
      const recCharsNames = allCharsNames.concat(charsNames);
      page++;
      this.getChars(page, recCharsNames);
    }
    const charsObjects = await Promise.all(allCharsNames.map((charName) => this.getChar(charName)));
    const aliveChars = charsObjects.filter(char => char.hitPoints !== 0)
    this.setState ({chars: aliveChars});
    return allCharsNames;
 }

  getChar = async (charName) => {
    const charObject = await this.dndFetch (`characters/${charName}`, 'GET');
    return charObject;
  }

  removeChar = (charObject) => {
    const newCharsList = this.state.chars.filter(element => element !==charObject);
    this.setState({chars: newCharsList});
  }

  charButtons = () => {
    if (!this.state.chars) {
      return <div> Loading </div>;
    } else {
      const displayChars = this.state.chars.map((element) => {
        return (
          <div 
            className="button"
            key={element.name}
            onClick={() => {this.setState({selectedChar : element})}}>
            {element.name}
          </div>
        )
      })
      return <div className="over box box1">{displayChars}</div>
    }
  }

  initializeSelectedChar = () => {
    this.setState({selectedChar: {}})
  }

  actionButton = (player) => {
    let buttonText;
    let buttonAction;
    if (player === "player1") {
      buttonText = "Click to set player 1";
      buttonAction = () => {
        this.setState({character1: this.state.selectedChar});
        this.removeChar(this.state.selectedChar);
        this.initializeSelectedChar();
      };
      
    } else {
      buttonText = "Click to set player 2";
      buttonAction = () => {
        this.setState({
          character2: this.state.selectedChar,
          selectedChar: {}
        })          
        this.removeChar(this.state.selectedChar)
        this.initializeSelectedChar();
      };
    }
    return (
      <button onClick={buttonAction}>{buttonText}</button>
    )
  }

  charFight = async (player1, player2) => {
    const turn = this.state.turn;
    const defender = (turn % 2 === 0)
      ? JSON.stringify({defender : player2.name})
      : JSON.stringify({defender : player1.name});
    const attacker = (turn % 2 === 0)
      ? player1.name
      : player2.name;
    console.log(`Attacker: ${attacker}, Defender: ${defender}`)
    const response = await this.dndFetch (`characters/${attacker}/attack`, 'POST', defender);
    this.setState({turn : turn + 1})
    this.setState({response: response.contents})
    if (response !== "CharacterDead") {
      this.setState({
        character1 : response.contents[0],
        character2 : response.contents[1],})
    }
  }

  charFight2 = async (attacker, defender, attIndex, defIndex) => {
    const turn = this.state.turn;
    const reqBody = JSON.stringify({defender : defender.name});
    const reqUrlSuffix = attacker.name;
    const response = await this.dndFetch (`characters/${reqUrlSuffix}/attack`, 'POST', reqBody);
    this.setState({turn : turn + 1})
    this.setState({response: response.contents})
    if (response !== "CharacterDead") {
      this.setState({
        character1 : response.contents[attIndex],
        character2 : response.contents[defIndex],})
    }
  }  

  fightButton = () => {
    const {character1, character2, turn} = this.state;
    const handleClick = () => (turn % 2 ===0)
      ? this.charFight2(character1, character2, 0, 1)
      : this.charFight2(character2, character1, 1, 0);
    return (
      <button key="fight" onClick={handleClick}>Fight</button>
    )
  }

  resetButton = () => {
    const handleClick = () => {
      this.setState({character1: {}, character2: {}, response: [], selectedChar: {}})
      this.getChars()
    }
    return (
      <button key="reset" onClick={handleClick}>Reset</button>
    )
  }

  whosTurn = () => {
    const text = (this.state.turn % 2 === 0)
      ? <h2 key = "turn">Next attack: Player 1</h2>
      : <h2 key = "turn">Next attack: Player 2</h2>;
    return text;
  }

  showResponse = () => {
    const response = this.state.response;
    if (response.length !== 0) {
      if (response[2].tag === "Missed") {
        return <h2 key="response"> Missed </h2>;
      } else if (response[2].tag === "Damaged") {
        return <h2 key="response"> {`Damaged for ${response[2].contents} HP`} </h2>
      } else if (response[2].tag === "Killed") {
        return <h2 key="response"> {`${this.state.character2.name} was killed!`} </h2>
      }
    }
    else {
      return <h2 key="response">Start fight</h2>
    }
  }

  creatCharButton = () => {
    return <button key='create' onClick={() => {this.setState({route: "create"})}}> Create Character </button>;
  }

  setCard1Contents = () => {
    const {selectedChar, character1, character2, route} = this.state;
    if (route === "create") {
      return ({
        header: "Create",
        content: <CreateChar setRoute={this.setRoute}/>
      })
    }
    if (character1.name && character2.name){
      return({
        header: "Ready!",
        content: [this.whosTurn(), this.fightButton(), this.resetButton(), this.showResponse()]
      })
    } else if (!selectedChar.name) {
      return({
        header: "Select Character",
        content: [<h3 key='text'> Choose from character on left</h3>, this.resetButton(), this.creatCharButton()]
      })
    } else {
      return({
        header: selectedChar.name,
        content: [characterTable(selectedChar), this.resetButton()]
      })
    }
  }

  setCard2Contents = () => {
    const {selectedChar, character1} = this.state;
    if (!selectedChar.name && !character1.name) {
      return({
        header: "Player 1",
        content: " "
      })
    } else if (!character1.name) {
      return({
        header: "Player 1",
        content: this.actionButton("player1")
      })

    } else {
      return({
        header: character1.name,
        content: characterTable(this.state.character1)
      })
    }
  }

  setCard3Contents = () => {
    const {selectedChar, character2} = this.state;
    if (!selectedChar.name && !character2.name) {
      return({
        header: "Player 2",
        content: " "
      })
    } else if (!this.state.character2.name) {
      return({
        header: "Player 2",
        content: this.actionButton("player2")
      })

    } else {
      return({
        header: this.state.character2.name,
        content: characterTable(this.state.character2)
      })
    }
  }

  setRoute = (route) => {
    this.setState({route: route});
    this.getChars();
  }

  render() {
    return (
      <div className="topDiv">
        <div className="header">
          <h1>DnD App</h1>
        </div>
        <div className ='gridContainer'>
          {this.charButtons()}
          <div className=" box box2">
            <Card contents={this.setCard1Contents()} />  
          </div>
          <div className="box box3">
            <Card contents={this.setCard2Contents()} />
          </div>
          <div className="box box4">
            <Card contents={this.setCard3Contents()} />
          </div>  
        </div>
      </div>
    ) 
  }   
}

export default App;
