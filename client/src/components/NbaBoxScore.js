import React, { Component } from 'react';
import { Table, Grid, Col, Row, Badge } from 'react-bootstrap';
import fetchHelper from '../serverHelpers/FetchHelper';

class NbaBoxScore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameState : null,
      homeName : null,
      awayName : null,
      homeQuarterScores : null,
      awayQuarterScores : null,
      width: 0,
      height: 0
    }

    this.consumeFeed = this.consumeFeed.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.consumeFeed();
    window.setInterval(this.consumeFeed, 5000);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  consumeFeed() {
    fetchHelper('/consumeNbaFeed', 'GET').then((response) => {
      const feed = response.data;

      this.setState({
        gameState: 'pregame',//feed.event_information.status,
        homeName: feed.home_team.abbreviation,
        awayName: feed.away_team.abbreviation,
        homeQuarterScores: feed.home_period_scores,
        awayQuarterScores: feed.away_period_scores,
        startTime: feed.event_information.start_date_time
      });
    });
  }

  getGameState(gameState) {
    if (gameState === 'pregame') {
      const date = new Date(this.state.startTime);
      return date.toLocaleTimeString();
    }
    else if (gameState === 'completed') {
      return 'Final'
    }
    return gameState;
  }

  getTotalScore(scoresList) {
    let total = 0;
    for (let i = 0; i < scoresList.length;i++) {
      total += scoresList[i]
    }
    return total;
  }

  render() {

    const boxScore = (
      <div>
        <Badge variant="secondary" style={{ marginTop: 10, width: 100, marginLeft: this.state.width/2 - 50 }}>{this.getGameState(this.state.gameState)}</Badge>
        <Table striped bordered condensed hover style={{ marginTop: 5, width: 600, marginLeft: this.state.width/2 - 300 }}>
          <thead>
            <tr>
              <td></td>
              <td>Q1</td>
              <td>Q2</td>
              <td>Q3</td>
              <td>Q4</td>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{this.state.homeName}</th>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.homeQuarterScores[0]}</td>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.homeQuarterScores[1]}</td>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.homeQuarterScores[2]}</td>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.homeQuarterScores[3]}</td>
              <th>{(this.state.homeQuarterScores === null) ? '' : this.getTotalScore(this.state.homeQuarterScores)}</th>
            </tr>
            <tr>
              <th>{this.state.awayName}</th>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.awayQuarterScores[0]}</td>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.awayQuarterScores[1]}</td>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.awayQuarterScores[2]}</td>
              <td>{(this.state.homeQuarterScores === null) ? '' : this.state.awayQuarterScores[3]}</td>
              <th>{(this.state.homeQuarterScores === null) ? '' : this.getTotalScore(this.state.homeQuarterScores)}</th>
            </tr>
          </tbody>
        </Table>
      </div>
    );

    return boxScore;
  }
};

export default NbaBoxScore;
