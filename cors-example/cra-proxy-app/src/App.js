import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    message: null,
    error: null,
  }

  fetchMessage = () => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(json => {
        const { data } = json
        this.setState({
          message: data,
        })
      })
      .catch(error => {
        this.setState({
          error: error,
        })
      });
  }

  componentDidMount() {
    this.fetchMessage();
  }

  render() {
    const { message, error } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button
          type='button'
          onClick={() => this.fetchMessage()}
        >
          Get Message
        </button>
        {
          message ? <p>message: {message}</p> :
          error ? <p>error: {error.toString()}</p> :
            <p>Click the Get Message button to get a message</p>
        }
      </div>
    );
  }
}

export default App;
