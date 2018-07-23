import React, { Component } from 'react';
import './App.css';
import './createChar.css';

class CreateChar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	name: '',
    	charClass: '',
    	alignment: '',
    }
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

  charClassRadioButtons = () => {
  	const classes = ['Fighter', 'Magic User', 'Cleric', 'Thief', 'Paladin']
  	return classes.map(charClass => <label key={charClass}><input type="radio" name="charClass" value={charClass} />{charClass}</label>)
  }

  alignmentRadioButtons = () => {
  	const alignments = ['Lawful', 'Neutral', 'Chaotic']
  	return alignments.map(alignment => <label key={alignment}><input type="radio" name="alignment" value={alignment} key={alignment} />{alignment}</label>)
  }

  handleSubmit = (event) => {
  	event.preventDefault();
  	const putReq = JSON.stringify(this.state);
  	this.dndFetch('characters', 'PUT', putReq);
    this.props.setRoute('home');
  }

  handleChange = (event) => {
  	const target = event.target;
  	const name = target.name;
  	const value = target.value;
  	this.setState({[name]: value})
  }

  render() {
  	return (
      <form className="createCharGrid" onSubmit={this.handleSubmit}>
        <div className="gridHead">
        	<label className="labelFlex" onChange={this.handleChange}><input type="text" name="name" placeholder="Character name" /></label>
        </div>
        <div className="charClass">
        	<label className="labelFlex" onChange={this.handleChange}>{this.charClassRadioButtons()}</label>
        </div>
        <div className="alignment">
        	<label className="labelFlex" onChange={this.handleChange}>{this.alignmentRadioButtons()}</label>
        </div>
      	<button className="gridFoot" type='submit'>Create</button>
      </form>
      )
  }
}

export default CreateChar;