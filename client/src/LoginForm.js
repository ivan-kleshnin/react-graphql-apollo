import React from "react"
import * as requests from "./requests"

export class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
    error: false
  }

  handleChange = (event) => {
    let {name, value} = event.target
    this.setState({[name]: value})
  }

  handleClick = (event) => {
    let {email, password} = this.state
    requests.login(email, password).then(token => {
      if (token) {
        this.props.onLogin(token)
      } else {
        this.setState({error: true})
      }
    })
  }

  render() {
    let {email, password, error} = this.state
    return (
      <form>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="text" name="email" value={email}
              onChange={this.handleChange} />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input className="input" type="password" name="password" value={password}
              onChange={this.handleChange} />
          </div>
        </div>
        <div className="field">
          <p className="help is-danger">
            {error && 'Invalid credentials'}
          </p>
          <div className="control">
            <button type="button" className="button is-link" onClick={this.handleClick}>
              Login
            </button>
          </div>
        </div>
      </form>
    )
  }
}
