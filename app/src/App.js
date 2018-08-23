import React from 'react'
import { hot } from 'react-hot-loader'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      message: 'No message',
    }
  }

  componentDidMount() {
    this.setState({
      message: 'Fetching message...',
    })
    fetch('/api/hello')
      .then(response => response.json())
      .then(json => {
        const { data } = json
        console.log(json)
        this.setState({
          message: data,
        })
      })
      .catch(err => {
        this.setState({
          message: 'Error fetching message :(',
        })
      })
  }

  render() {
    const { message } = this.state
    return (
      <div>
        <h1>Message below</h1>
        <p>{message}</p>
      </div>
    )
  }
}

export default hot(module)(App)
