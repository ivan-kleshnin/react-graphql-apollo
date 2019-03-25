import React from "react"
import * as requests from "./requests"

export class JobForm extends React.Component {
  state = {
    title: "",
    description: ""
  }

  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  handleClick = (event) => {
    let job = {...this.state, companyId: "SJV0-wdOM"}
    let {me} = this.props
    requests.createJob(me, job).then(job => {
      this.props.history.push(`/jobs/${job.id}`)
    })
  }

  render() {
    const {title, description} = this.state
    return <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input" type="text" name="title" value={title}
                onChange={this.handleChange} />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea className="input" style={{height: "10em"}}
                name="description" value={description} onChange={this.handleChange} />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="button" className="button is-link" onClick={this.handleClick}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  }
}
