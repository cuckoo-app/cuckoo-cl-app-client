import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
// import "./Home.css";
import JobCard from '../components/JobCard'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px`,
    backgroundColor: 'crimson'
  },
  paper: {
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
  },
});

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      jobs: props.jobs,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const jobs = await API.get("jobs", "/jobs");
      this.setState({ jobs });
      this.props.setJobs(jobs);
    } catch (e) {
      alert(e);
    }

    this.setState({
      isLoading: false,
    });
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  renderJobsList(jobs) {
    return jobs.map(
      (job, i) =>
        <JobCard job={job} key={job.jobId}/>
        // <Card>
        //   <ListGroupItem header={job.command.trim().split("\n")[0]}>
        //     {"Created: " + new Date(job.dateCreated).toLocaleString()}
        //   </ListGroupItem>
        // </Card>
    );
  }

  // renderJobsList(jobs) {
  //   return jobs.map(
  //     (job, i) =>
  //       <LinkContainer
  //         key={job.jobId}
  //         to={`/jobs/${job.jobId}`}
  //       >
  //         <ListGroupItem header={job.command.trim().split("\n")[0]}>
  //           {"Created: " + new Date(job.dateCreated).toLocaleString()}
  //         </ListGroupItem>
  //       </LinkContainer>
  //   );
  // }

  renderLander() {
    return (
      <div className="lander">
        <h1>Cuckoo CL</h1>
        <p>Easily track the progress of your command line jobs</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderJobs() {
    const { classes } = this.props;

    return (
      <div className="jobs">
        <div style={{height: 20}}></div>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom={true}>My Jobs</Typography>
        <div style={{height: 10}}></div>
        <Paper className={classes.root}>
          {!this.state.isLoading && this.renderJobsList(this.state.jobs)}
        </Paper>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderJobs() : this.renderLander()}
      </div>
    );
  }
}

export default withStyles(styles)(Home);
