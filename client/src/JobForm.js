import React from "react"
import * as requests from "./requests"
import {withContext} from "./AppContext"

export default withContext(class JobForm extends React.Component {
  state = {
    title: "",
    description: ""
  }

  handleChange = (event) => {
    let {name, value} = event.target
    this.setState({[name]: value})
  }

  handleClick = async (event) => {
    let {history} = this.props
    let input = {...this.state, companyId: "SJV0-wdOM"}
    let {me} = this.props
    try {
      var job = await requests.createJob(me, input)
    } catch (err) {
      return alert(err.message)
    }
    history.push(`/jobs/${job.id}`)
  }

  render() {
    let {title, description} = this.state
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
})
