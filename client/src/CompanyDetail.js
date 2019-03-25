import React from "react"
import {Link} from "react-router-dom"
import * as requests from "./requests"

export class CompanyDetail extends React.Component {
  state = {
    company: null,
  }

  async componentDidMount() {
    let {id} = this.props.match.params
    let {me} = this.props
    let company = await requests.loadCompany(me, id)
    this.setState({company})
  }

  render() {
    const {company} = this.state
    if (!company) {
      return null
    }
    return <div>
      <h1 className="title is-1">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-2">Jobs</h2>
      <JobList jobs={company.jobs}/>
    </div>
  }
}

function JobList({jobs}) {
  return <ul className="box">
    {jobs.map(job =>
      <Job key={job.id} job={job}/>
    )}
  </ul>
}

function Job({job}) {
  let title = job.company ? `${job.title} at ${job.company.name}` : job.title;
  return <li className="media" key={job.id}>
    <div className="media-content">
      <Link to={`/jobs/${job.id}`}>{title}</Link>
    </div>
  </li>
}
