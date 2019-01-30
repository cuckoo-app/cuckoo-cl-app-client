import React, { Component } from "react";
import ReactDOM from "react-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { API, Storage } from "aws-amplify";
// import "./Home.css";

import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/styles/prism';

const styles = theme => ({
  card: {
    margin: `${theme.spacing.unit * 1}px auto`,
  },
  header: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingTop: theme.spacing.unit,
  },
  component: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingTop: theme.spacing.unit,
  },
  text: {
    margin: 0,
  },
  actions: {
    display: 'flex',
    padding: `${theme.spacing.unit}px`,
    // paddingTop: theme.spacing.unit,
  },
  expandContent: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingBottom: theme.spacing.unit,
  },
  expand: {
    padding: 0,
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  detailButton: {
    marginLeft: theme.spacing.unit
  }
});

class JobCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      job: props.job,
      stdoutText: "",
      stdout: "",
    }
  }

  async componentDidMount() {
    try {
      let stdoutText;
      let stdout = this.state.job.stdout;
      if (stdout) {
        await Storage.vault.get(this.state.job.stdout, {download: true})
        .then(result => {
          stdoutText = decodeURIComponent(escape(result.Body));
        })
      }

      this.setState({
        stdoutText,
        stdout
      });
    } catch (e) {
      alert(e);
    }

    // this.stdoutEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;
    var runtime_background_color;
    switch (this.state.job.jobStatus) {
      case 'running':
        runtime_background_color = 'limegreen'
        break;
      case 'success':
        runtime_background_color = 'deepskyblue'
        break;
      case 'error':
        runtime_background_color = 'crimson'
        break;
      case 'crash':
        runtime_background_color = 'grey'
        break;
      default:
        runtime_background_color = 'white'
    }
    var jobWeight = this.state.job.unread ? 'bold' : 'normal'


    return (
      <Card
        className={classes.card}
        raised={false}
      >
        <CardContent className={classes.header}>
          <Grid justify="space-between" // Add it here :)
            container
            direction="row"
            alignItems="center"
            style={{flexWrap: 'nowrap'}}
          >
            <Typography variant="h4" noWrap style={{ fontWeight: jobWeight}}>
              {this.state.job.command}
            </Typography>
            <div className={classes.text}>
              <Chip variant="outlined" label={
                <Typography variant="h4" style={{backgroundColor: runtime_background_color}}>
                  {this.state.job.runtime}
                </Typography>
              } style={{backgroundColor: runtime_background_color}}
              />
            </div>
          </Grid>
        </CardContent>
        <CardContent className={classes.component}>
          <Grid justify="space-between" // Add it here :)
            container
            direction="row"
            alignItems="center"
            style={{flexWrap: 'nowrap'}}
          >
            <Typography className={classes.text} variant="h6" noWrap>{this.state.job.machine}</Typography>
            <Typography className={classes.text} variant="h6">{new Date(this.state.job.dateCreated).toLocaleString()}</Typography>
          </Grid>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <Button
            color="secondary"
            variant="outlined"
            component={Link}
            to={`/jobs/${this.state.job.jobId}`}
            className={classes.detailButton}
          >
            <Typography variant="button"> See Job Details </Typography>
          </Button>
          <IconButton
            size="small"
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse className={classes.expandContent} in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent style={{padding: 0}}>
            <SyntaxHighlighter language='zsh' style={atomDark}
              customStyle={{fontSize: 14, margin: 0,
              maxHeight: 200, overflow: 'auto'}}>
              {this.state.stdoutText}
            </SyntaxHighlighter>
            <div style={{ float: "left", clear: "both" }}
              ref={(el) => {this.stdoutEnd = el;}}>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

JobCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobCard);
