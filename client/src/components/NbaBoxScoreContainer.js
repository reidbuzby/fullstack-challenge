import React, { Component } from 'react';
import NbaBoxScore from './NbaBoxScore';

class NbaBoxScoreContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameState : 'pre-game',
      quarter : null
    }
  }

  render() {
    return (
      <NbaBoxScore gameState={this.state.gameState} quarter={this.state.quarter} />
    );
  }

}

export default NbaBoxScoreContainer;
