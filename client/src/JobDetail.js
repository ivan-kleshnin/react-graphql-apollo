import React from "react"
import {Link} from "react-router-dom"
import * as requests from "./requests"

export class JobDetail extends React.Component {
  state = {
    job: null,
  }

  async componentDidMount() {
    let {id} = this.props.match.params
    let {me} = this.props
    let job = await requests.loadJob(me, id)
    this.setState({job})
  }

  render() {
    let {job} = this.state
    if (!job) {
      return null
    }
    return <div>
      <h1 className="title">{job.title}</h1>
      <h2 className="subtitle">
        At <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">{job.description}</div>
    </div>
  }
}
