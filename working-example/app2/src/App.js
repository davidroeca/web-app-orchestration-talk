import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    items: [],
    error: null,
  }

  fetchItems = () => {
    // defined as arrow function to bind `this`
    fetch('/api/items', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        const { data } = json
        console.log(json)
        this.setState({
          items: data,
          error: null,
        })
      })
      .catch(error => {
        this.setState({
          items: [],
          error,
        })
      });
  }

  componentDidMount() {
    this.fetchItems();
  }

  render() {
    const { items, error } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {!error && items && items.length ? (
          <ol>
            {items.map((item, index) => (
              <li key={index}>
                item: {item.value}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    );
  }
}

export default hot(module)(App);
