import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {CompanyDetail} from './CompanyDetail'
import {LoginForm} from './LoginForm'
import {JobBoard} from './JobBoard'
import {JobDetail} from './JobDetail'
import {JobForm} from './JobForm'
import {NavBar} from './NavBar'

const AUTH_KEY = "accessToken"

function getSession() {
  return localStorage.getItem(AUTH_KEY)
}

function createSession(token) {
  localStorage.setItem(AUTH_KEY, token)
}

function destroySession() {
  localStorage.removeItem(AUTH_KEY)
}

export class App extends React.Component {
  constructor(props) {
    super(props)
    let token = getSession()
    this.state = {
      me: token ? {token}: null,
    }
  }

  handleLogin = (token) => {
    createSession(token)
    this.setState({me: {token}})
    this.router.history.push('/')
  }

  handleLogout = () => {
    destroySession()
    this.setState({me: null})
    this.router.history.push('/')
  }

  render() {
    const {me} = this.state
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
