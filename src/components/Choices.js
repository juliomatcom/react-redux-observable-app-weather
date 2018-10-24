import React, { Component } from 'react';
import './Choices.css';

class Choices extends Component {
  render() {
    const choices = this.props.choices.map(choice => {
      return (
        <li
          onMouseEnter={this.props.eventSub(choice)}
          key={choice}>
            {choice}
        </li>
      );
    });

    return (
      <ul className="choices">
        {choices}
      </ul>
    );
  }
}

export default Choices;
