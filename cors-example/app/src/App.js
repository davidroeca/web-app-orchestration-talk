import React from 'react'
import { hot } from 'react-hot-loader'

class App extends React.Component {

  state = {
    message: null,
    error: null,
  }

  getMessage = () => {
    fetch('http://localhost:5000/api/hello', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        const { data } = json
        this.setState({
          message: data,
          error: null,
        })
      })
      .catch(error => {
        this.setState({
          error: error,
        })
      })

  }

  componentDidMount() {
    this.getMessage()
  }

  render() {
    const { message, error } = this.state
    return (
      <div>
        <button
          type='button'
          onClick={this.getMessage}
        >
          Get message
        </button>
        {
          message ?
            <p>Message: {message}</p> :
          error ?
            <p>Could not find message; error: {error.toString()}</p> :
            <p>Waiting for message...</p>
        }
      </div>
    )
  }
}

export default hot(module)(App)
