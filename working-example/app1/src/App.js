import React from 'react'
import { hot } from 'react-hot-loader'
import './App.css'

class App extends React.Component {

  state = {
    items: [],
    newItemValue: '',
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
      })
  }

  updateNewItem = (item) => {
    this.setState({
      newItemValue: item,
    })
  }

  createNewItems = (items) => {
    const body = JSON.stringify({items})
    console.log(body)
    fetch('/api/items', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    })
      .then(response => response.json())
      .then(json => {
        const { data } = json
        console.log(json)
        const oldData = this.state.data
        this.setState({
          items: [...oldData, ...data],
          error: null,
        })
      })
      .catch(error => {
        this.setState({
          items: oldData,
          error,
        })
      })
  }

  componentDidMount() {
    this.fetchItems()
  }

  render() {
    const { items, error } = this.state
    return (
      <div className='App'>
        <div>
          <a href='/app2'>Go to App 2</a>
        </div>
        <button
          type='button'
          onClick={this.fetchItems}
        >
          refresh items
        </button>
        <h1>Items below</h1>
        <div>
          <ol>
            {items.map((item, index) => (
              <li key={index}>
                {item.value}
              </li>
            ))}
          </ol>
        </div>
        {error ? <p>{error}</p> : null}
        <div>
          <label>
            Add new item{" "}
          </label>
          <input
            value={this.state.newItemValue}
            onChange={(event) => this.updateNewItem(event.target.value)}
          />
        </div>
        <button
          type='button'
          onClick={() => this.createNewItems([{value: this.state.newItemValue}])}
        >
          create new item
        </button>
      </div>
    )
  }
}

export default hot(module)(App)
