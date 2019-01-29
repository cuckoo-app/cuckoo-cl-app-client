import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
// import "./App.css";
import Routes from "./Routes";
import Header from "./containers/Header";
import { API } from "aws-amplify";

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  body: {
    width: '85%'
  },
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      emailConfirmed: false,
      isAuthenticating: true,
      isLoading: true,
      jobs: [],
      url: "/",
    };
  }

  jobs() {
    return API.get("jobs", "/jobs");
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
      try {
        const jobs = await this.jobs();
        this.setState({ jobs });
        console.log(jobs)
      } catch (e) {
        alert(e);
      }
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({
      isAuthenticating: false,
      isLoading: false,
    });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  redirectHome = url => {
    this.setState({ url: url });
  }

  setJobs = jobs => {
    this.setState({ jobs: jobs });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      jobs: this.state.jobs,
      redirectHome: this.redirectHome,
      setJobs: this.setJobs,
    };
    const { classes } = this.props;
    return (
      !this.state.isAuthenticating &&
      <div>
        <Header {...childProps}/>
        <Grid
          container
          justify="center"
        >
          <div className={classes.body}>
              <Routes childProps={childProps} />
          </div>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
