import React, { Component } from 'react';
import { Table, Grid, Col, Row, Badge } from 'react-bootstrap';
import fetchHelper from '../serverHelpers/FetchHelper';

class MlbBoxScore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameState : null,
      homeName : null,
      awayName : null,
      homeRuns: null,
      awayRuns: null,
      homeHits: null,
      awayHits: null,
      homeErrors: null,
      awayErrors: null,
      homeInningScores : null,
      awayInningScores : null,
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
    fetchHelper('/consumeMlbFeed', 'GET').then((response) => {
      const feed = response.data;

      this.setState({
        gameState: 'pregame',//feed.event_information.status,
        homeName: feed.home_team.abbreviation,
        awayName: feed.away_team.abbreviation,
        homeRuns: feed.home_batter_totals.runs,
        awayRuns: feed.away_batter_totals.runs,
        homeHits: feed.home_batter_totals.hits,
        awayHits: feed.away_batter_totals.hits,
        homeErrors: feed.home_errors,
        awayErrors: feed.away_errors,
        homeInningScores: feed.home_period_scores,
        awayInningScores: feed.away_period_scores,
        startTime: feed.event_information.start_date_time,
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

  getHomeInnings() {
    if (this.state.homeInningScores !== null) {
      var innings = [];
      for (let i=0;i<this.state.homeInningScores.length;i++) {
        innings.push(
          <td>{this.state.homeInningScores[i]}</td>
        );
      }
      return innings;
    }
    return null;
  }

  getAwayInnings() {
    if (this.state.awayInningScores !== null) {
      var innings = [];
      for (let i=0;i<this.state.awayInningScores.length;i++) {
        innings.push(
          <td>{this.state.awayInningScores[i]}</td>
        );
      }
      return innings;
    }
    return null;
  }

  render() {

    const boxScore = (
      <div>
        <Badge variant="secondary" style={{ marginTop: 10, width: 100, marginLeft: this.state.width/2 - 50 }}>{this.getGameState(this.state.gameState)}</Badge>
        <Table striped bordered condensed hover style={{ marginTop: 5, width: 600, marginLeft: this.state.width/2 - 300 }}>
          <thead>
            <tr>
              <td></td>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <th>R</th>
              <th>H</th>
              <th>E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{this.state.homeName}</th>
              {this.getHomeInnings()}
              <th>{this.state.homeRuns}</th>
              <th>{this.state.homeHits}</th>
              <th>{this.state.homeErrors}</th>
            </tr>
            <tr>
              <th>{this.state.awayName}</th>
              {this.getAwayInnings()}
              <th>{this.state.awayRuns}</th>
              <th>{this.state.awayHits}</th>
              <th>{this.state.awayErrors}</th>
            </tr>
          </tbody>
        </Table>
      </div>
    );

    return boxScore;
  }
};

export default MlbBoxScore;
