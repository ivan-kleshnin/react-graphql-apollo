import React, {Component} from "react"
import {Link} from "react-router-dom"
import * as requests from "./requests"

export class JobBoard extends Component {
  state = {
    jobs: []
  }

  async componentDidMount() {
    let {me} = this.props
    let jobs = await requests.loadJobs(me)
    this.setState({jobs})
  }

  render() {
    let {jobs} = this.state
    return <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
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
