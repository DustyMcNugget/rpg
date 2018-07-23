import React, { Component } from 'react';
import CreateChar from './createChar.js';
import CharacterTable from './components/CharacterTable/CharacterTable.js'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'home',
      selectedChar: {},
      attacker: {},
      defender: {},
    }
  }

  componentDidMount() {
    this.getChars();
  }

  componentDidUpdate() {

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
    this.setState ({chars: charsObjects});
    return allCharsNames;
 }

  getChar = async (charName) => {
    const charObject = await this.dndFetch (`characters/${charName}`, 'GET');
    return charObject;
  }

  charFight = async (attacker, defender) => {
    const body = {defender: defender.name};
    const bodyStr = JSON.stringify(body);
    const response = await this.dndFetch (`characters/${attacker.name}/attack`, 'POST', bodyStr);
    console.log(response);
    alert(response.contents[2].tag + " " + response.contents[2].contents);
    this.setState({attacker : response.contents[0], defender : response.contents[1]})

  }

  removeChar = (charObject) => {
    const newCharsList = this.state.chars.filter(element => element !==charObject);
    this.setState({chars: newCharsList});
  }

  actionButton = () => {
    let buttonText;
    let buttonAction;
    if (!this.state.attacker.name) {
      buttonText = "Set Attacker";
      buttonAction = () => {
        this.setState({attacker: this.state.selectedChar});
        this.removeChar(this.state.selectedChar);
      };
      
    } else {
      buttonText = "Set Defender";
      buttonAction = () => {
        this.setState({defender: this.state.selectedChar})          
        this.removeChar(this.state.selectedChar)
      };
    }
    return (
      <button onClick={buttonAction}>{buttonText}</button>
    )
  }

  resetButton = () => {
    const handleClick = () => {
      this.setState({attacker: {}, defender: {}})
      this.getChars()
    }
    return (
      <button onClick={handleClick}>Reset</button>
    )
  }

  fightButton = () => {
    const {attacker, defender} = this.state;
    let handleClick;
    if (attacker.name && defender.name){
      handleClick = () => {this.charFight(attacker, defender)};
    } else {
      handleClick = () => {alert('Select Attacker AND Defender')};
    }
    return (
      <button onClick={handleClick}>Fight</button>
      )
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
      return <div className="over box1">{displayChars}</div>
    }
  }

  setRoute = (route) => {
    this.setState({route: route});
  }

  render() {
    if (this.state.route === 'home') {
      return (
      <div className="topDiv">
        <div className="header">
          <h1>DnD App</h1>
        </div>
        <div className ='gridContainer'>
          {this.charButtons()}
          <CharacterTable className="box2" selectedChar={this.state.selectedChar} altText="Select a character" />       
          <div className="box3">
            <div>
              {'Attacker is: ' + this.state.attacker.name + " / HP: " +this.state.attacker.hitPoints}
            </div>
            <div>
              {'Defender is: ' + this.state.defender.name + " / HP: " +this.state.defender.hitPoints}
            </div>
          </div>
          <div className="box4">
            <div>{this.actionButton()}</div>
            <div>{this.resetButton()}</div>
            <div>{this.fightButton()}</div>
          </div>  
        </div>
      </div>
      )
    } else {
      return (
        <CreateChar setRoute={this.setRoute} />
      )
    } 
  }   
}

export default App;
