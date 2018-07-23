import React from 'react';
import '../.././App.css';
import './Card.css'

const Card = (props) => {
  const headerContent = (props.contents.header ? props.contents.header : 'Header') 
  const mainContent = (props.contents.content ? props.contents.content : 'Content')
  return (
  	<div className="card">
      <div className="cardHeader">
        {headerContent}
      </div>
      <div className="content">
        {mainContent}
      </div>
  	</div>
	)
}
export default Card;