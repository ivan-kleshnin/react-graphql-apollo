import React from "react"
import {Link} from "react-router-dom"
import {withContext} from "./AppContext"

export default withContext(function NavBar({me, logout}) {
  return <nav className="navbar">
    <div className="navbar-start">
      <Link className="navbar-item" to="/">Jobs</Link>
      <Link className="navbar-item" to="/companies">Companies</Link>
      {me ? <a className="navbar-item" onClick={logout}>Logout</a>
          : <Link className="navbar-item" to="/login">Login</Link>}
    </div>
  </nav>
})
