import React from "react"
import * as requests from "./requests"
import {withContext} from "./AppContext"

export default withContext(class LoginForm extends React.Component {
  state = {
    email: "alice@facegle.io",
    password: "",
  }

  handleChange = (event) => {
    let {name, value} = event.target
    this.setState({[name]: value})
  }

  handleClick = async (event) => {
    let {login} = this.props
    let {email, password} = this.state
    try {
      var user = await requests.login(email, password)
    } catch (err) {
      return alert(err.message)
    }
    login(user)
  }

  render() {
    let {email, password} = this.state
    return <form>
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
          {/*error && "Invalid credentials"*/}
        </p>
        <div className="control">
          <button type="button" className="button is-link" onClick={this.handleClick}>
            Login
          </button>
        </div>
      </div>
    </form>
  }
})
