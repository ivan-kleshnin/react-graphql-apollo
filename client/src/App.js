import React from "react"
import {Route, Switch} from "react-router-dom"
import JobBoard from "./JobBoard"
import JobDetail from "./JobDetail"
import CompanyBoard from "./CompanyBoard"
import CompanyDetail from "./CompanyDetail"
import JobForm from "./JobForm"
import LoginForm from "./LoginForm"
import NavBar from "./NavBar"

function Log() {
  console.log("Log" + Math.random())
  return null
}

export default function App() {
  return <div>
    <Log/>
    <NavBar/>
    <section className="section">
      <div className="container">
        <Switch>
          <Route exact path="/" component={JobBoard}/>
          <Route exact path="/jobs/new" component={JobForm}/>
          <Route path="/jobs/:id" component={JobDetail}/>
          <Route exact path="/companies" component={CompanyBoard}/>
          <Route path="/companies/:id" component={CompanyDetail}/>
          <Route exact path="/login" component={LoginForm}/>
        </Switch>
      </div>
    </section>
  </div>
}
