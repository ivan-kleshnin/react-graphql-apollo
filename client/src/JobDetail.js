import React from "react"
import {Link} from "react-router-dom"
import {withContext} from "./AppContext"
import * as requests from "./requests"

export default withContext(class JobDetail extends React.Component {
  state = {
    job: null,
  }

  async componentDidMount() {
    // console.log("@ JobDetail.componentDidMount")
    let {match, me} = this.props
    let {id} = match.params
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
})
