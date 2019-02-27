import React, { Component } from 'react';
import { Table, Grid, Col, Row } from 'react-bootstrap';

class NbaBoxScore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameState : props.gameState,
      quarter : props.quarter,
      homeName : 'NE',
      awayName : 'NYG',
      homeQuarterScores : [14, 3, 7, 10],
      awayQuarterScores : [0, 3, 0, 7]
    }

    this.getHomeQuarterScores = this.getHomeQuarterScores.bind(this);
    this.getAwayQuarterScores = this.getAwayQuarterScores.bind(this);

    this.getHomeQuarterScores();
    this.getAwayQuarterScores();
  }

  getTotalScore(scoresList) {
    let total = 0;
    for (let i = 0; i < scoresList.length;i++) {
      total += scoresList[i]
    }
    return total;
  }

  getHomeQuarterScores() {
    this.setState({ homeQuarterScores : [14, 3, 7, 10] });
  }

  getAwayQuarterScores() {
    this.setState({ awayQuarterScores : [0, 3, 0, 7] });
  }

  render() {

    const boxScore = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <td></td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.state.homeName}</td>
            <td>{this.state.homeQuarterScores[0]}</td>
            <td>{this.state.homeQuarterScores[1]}</td>
            <td>{this.state.homeQuarterScores[2]}</td>
            <td>{this.state.homeQuarterScores[3]}</td>
            <th>{this.getTotalScore(this.state.homeQuarterScores)}</th>
          </tr>
          <tr>
            <td>{this.state.awayName}</td>
            <td>{this.state.awayQuarterScores[0]}</td>
            <td>{this.state.awayQuarterScores[1]}</td>
            <td>{this.state.awayQuarterScores[2]}</td>
            <td>{this.state.awayQuarterScores[3]}</td>
            <th>{this.getTotalScore(this.state.homeQuarterScores)}</th>
          </tr>
        </tbody>
      </Table>
    );

    return boxScore;

    // switch (this.state.gameState) {
    //   case 'pre-game':
    //     return ();
    //   case 'in-game':
    //     return ();
    //   case 'post-game':
    //     return ();
    // }
  }
};

export default NbaBoxScore;
