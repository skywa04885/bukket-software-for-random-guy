import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from "./components/main.page";

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h1>Korte klachten check</h1>
        </div>
        <Main />
      </div>
    );
  }
}

export default App;
