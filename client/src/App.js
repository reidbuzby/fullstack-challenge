import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import NbaBoxScore from './components/NbaBoxScore';
import MlbBoxScore from './components/MlbBoxScore';

/* eslint-disable react/prefer-stateless-function */
class App extends Component {

  constructor() {
    super();

    this.state = {
      viewMode: 'nba',
      width: 0,
      height: 0
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
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

  handleViewChange(e) {
    this.setState({ viewMode: e });
  }

  render() {

    const radio = (
      <div style={{ marginTop: 10, marginBottom: 50, marginLeft: this.state.width/2 - 55 }}>
        <ToggleButtonGroup name="toggle-boxscore" type="radio" value={this.state.viewMode} onChange={this.handleViewChange}>
          <ToggleButton value="nba">NBA</ToggleButton>
          <ToggleButton value="mlb">MLB</ToggleButton>
        </ToggleButtonGroup>
      </div>
    );

    if (this.state.viewMode === 'nba') {
      return (
        <div>
          {radio}
          <NbaBoxScore />
        </div>
      );
    }

    return (
      <div>
        {radio}
        <MlbBoxScore />
      </div>
    )

  }
}

export default App;
