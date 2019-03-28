import React from "react"
import {Link} from "react-router-dom"
import {withContext} from "./AppContext"
import * as requests from "./requests"

export default withContext(class CompanyBoard extends React.Component {
  state = {
    companies: [],
  }

  async componentDidMount() {
    // console.log("@ CompanyBoard.componentDidMount")
    let {me} = this.props
    let companies = await requests.loadCompanies(me)
    this.setState({companies})
  }

  render() {
    let {companies} = this.state
    return <div>
      <h1 className="title">Company Board</h1>
      <CompanyList companies={companies}/>
    </div>
  }
})

function CompanyList({companies}) {
  return <ul className="box">
    {companies.map(company =>
      <Company key={company.id} company={company}/>
    )}
  </ul>
}

function Company({company}) {
  return <li className="media" key={company.id}>
    <div className="media-content">
      <Link to={`/companies/${company.id}`}>{company.name}</Link>
    </div>
  </li>
}
