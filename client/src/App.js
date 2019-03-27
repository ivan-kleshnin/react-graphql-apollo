import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {CompanyDetail} from "./CompanyDetail"
import {LoginForm} from "./LoginForm"
import {JobBoard} from "./JobBoard"
import {JobDetail} from "./JobDetail"
import {JobForm} from "./JobForm"
import {NavBar} from "./NavBar"

let AUTH_KEY = "auth"

function getSession() {
  return JSON.parse(localStorage.getItem(AUTH_KEY))
}

function createSession(me) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(me))
}

function destroySession() {
  localStorage.removeItem(AUTH_KEY)
}

export class App extends React.Component {
  constructor(props) {
    super(props)
    let me = getSession()
    this.state = {me}
  }

  handleLogin = (user) => {
    console.log("@ handleLogin, user =", user)
    createSession(user)
    this.setState({me: user})
    this.router.history.push("/")
  }

  handleLogout = () => {
    console.log("@ handleLogout")
    destroySession()
    this.setState({me: null})
    this.router.history.push("/")
  }

  render() {
    const {me} = this.state
    console.log("@ App.render, me =", me)
    return <Router ref={(router) => this.router = router}>
      <div>
        <NavBar loggedIn={Boolean(me)} onLogout={this.handleLogout} />
        <section className="section">
          <div className="container">
            <Switch>
              <Route exact path="/" render={({match, history}) => {
                return <JobBoard match={match} history={history} me={me}/>
              }}/>
              <Route path="/companies/:id" render={({match, history}) =>
                <CompanyDetail match={match} history={history} me={me}/>} />
              }/>
              <Route exact path="/jobs/new" render={({match, history}) =>
                <JobForm match={match} history={history} me={me}/>
              }/>
              <Route path="/jobs/:id" render={({match, history}) =>
                <JobDetail match={match} history={history} me={me} key={match.params.id}/>
              }/>
              <Route exact path="/login" render={({match, history}) =>
                <LoginForm match={match} history={history} me={me} onLogin={this.handleLogin}/>
              }/>
            </Switch>
          </div>
        </section>
      </div>
    </Router>
  }
}

//
// // if (login.token) {
//   //   localStorage.setItem(AUTH_KEY, token)
//   // }

//
// export function logout() {
//   localStorage.removeItem(AUTH_KEY)
// }
