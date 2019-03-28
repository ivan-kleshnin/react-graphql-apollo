import React from "react"
import {BrowserRouter as Router} from "react-router-dom"

export let AUTH_KEY = "auth"

export function getSession() {
  return JSON.parse(localStorage.getItem(AUTH_KEY))
}

export function createSession(me) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(me))
}

export function destroySession() {
  localStorage.removeItem(AUTH_KEY)
}

export let AppContext = React.createContext()

export default class AppContextProvider extends React.Component {
  constructor(props) {
    super(props)
    let me = getSession()
    this.state = {me}
  }

  login = (user) => {
    createSession(user)
    this.setState({me: user})
    this.router.history.push("/")
  }

  logout = () => {
    destroySession()
    this.setState({me: null})
    this.router.history.push("/")
  }

  render() {
    let {children} = this.props
    let value = {
      ...this.state,
      login: this.login,
      logout: this.logout,
    }
    return <Router ref={router => this.router = router}>
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    </Router>
  }
}

export let withContext = (Component) => {
  return (props) => {
    return <AppContext.Consumer>
      {(data) =>
        <Component {...data} {...props}/>
      }
    </AppContext.Consumer>
  }
}
