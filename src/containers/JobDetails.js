import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/styles/prism';
import LoaderButton from "../components/LoaderButton";

export default class Job extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      job: null,
      stdoutText: "",
      stdout: "",
      width: 0,
      height: 0,
      isDeleting: null,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  jobs() {
    return API.get("jobs", "/jobs");
  }

  numUnread(jobs) {
    return jobs.filter(job => job.unread).length;
  }

  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    try {
      let stdoutText;
      const job = await this.getJob();
      const { stdout } = job;
      this.setState({ job });

      try {
        if (stdout) {
          await Storage.vault.get(stdout, {download: true})
          .then(result => {
            stdoutText = decodeURIComponent(escape(result.Body));
          })
        }
        this.setState({
          stdoutText,
          stdout
        });
        console.log('asdfasdfasdf', this.state)
      } catch (e) {
        console.log(e);
        console.log('File not set');
        this.setState({
          stdoutText: 'Job running! No stdout currently available.',
          stdout: '',
        })
      }

      if (this.state.jobs === null) {
        var jobs;
        try {
          jobs = await this.jobs();
        } catch (e) {
          alert(e);
        }
        this.props.setJobs(jobs);
      }
      if (this.state.numUnread === null) {
        var numUnread = this.numUnread(jobs);
        this.props.setNumUnread(numUnread);
      }

      if (this.state.job.unread) {
        await this.updateRead(job);
        // not technically changing this job state though
        this.props.setNumUnread(this.props.numUnread - 1)
      }
    } catch (e) {
      alert(e);
    }

    var element = document.getElementById("commandline");
    element.scrollTop = element.scrollHeight;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  getJob() {
    return API.get("jobs", `/jobs/${this.props.match.params.id}`);
  }

  updateRead(job) {
    let params = {
      body: job
    }
    params.body.unread = false
    console.log(params)
    return API.put("jobs",
                   `/jobs/${this.props.match.params.id}`,
                   params);
  }

  async deleteJob() {
    await Storage.vault.remove(this.state.stdout)
    .then(result => {console.log(result)})
    .catch(err => console.log(err));
    return API.del("jobs", `/jobs/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteJob();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Job">
        {this.state.job &&
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <h2>Command: {this.state.job.command}</h2>
            <h3>Job Status: {this.state.job.jobStatus}</h3>
            <h3>Runtime: {this.state.job.runtime}</h3>
            <hr />
            <p>Machine: {this.state.job.machine}</p>
            <p>Date Created: {new Date(this.state.job.dateCreated).toLocaleString()}</p>
            <p>Date Modified: {new Date(this.state.job.dateModified).toLocaleString()}</p>
            <hr />
            <h4>Standard Out:</h4>
            <SyntaxHighlighter language='zsh' id='commandline' style={atomDark}
              customStyle={{fontSize: 16,
              maxHeight: this.state.height / 2, overflow: 'auto'}}>
              {this.state.stdoutText}
            </SyntaxHighlighter>
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </div>
        }
      </div>
    );
  }
}
