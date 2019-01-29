import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
// import "./App.css";
import { API } from "aws-amplify";

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';


const styles = theme => ({
  root: {
    width: '100%',
  },
  body: {
    width: '85%'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'block',
    textDecoration: 'none'
    // [theme.breakpoints.up('sm')]: {
    //   display: 'block',
    // },
  },
  titleHover: {
    textDecoration: 'none'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 5,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 5,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
    };
  }

  handleAccountMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  componentDidMount() {
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.props.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  numUnread() {
    return this.props.jobs.filter(job => job.unread === true).length;
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
        getContentAnchorEl={null}
      >
        <MenuItem
          component={Link}
          to="/settings"
          onClick={this.handleMenuClose}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            this.handleLogout();
            this.handleMenuClose();
          }}
        >
          Log Out
        </MenuItem>
      </Popover>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
        getContentAnchorEl={null}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleAccountMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Account</p>
        </MenuItem>
      </Menu>
    );

    return (
      !this.props.isAuthenticating &&
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Grid
              justify="space-between" // Add it here :)
              container
              direction="row"
              alignItems="center"
            >
              <Grid item>
                <Typography
                  className={classes.title}
                  classes={{root: classes.titleHover}}
                  variant="h3"
                  color="inherit"
                  noWrap
                  component={'a'}
                  href="/"
                >
                  Cuckoo CL
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                  />
                </div>
              </Grid>
              <div className={classes.grow} />
              <Grid item>
                <div className={classes.sectionDesktop}>
                  {this.props.isAuthenticated
                    ? <Fragment>
                        <IconButton color="inherit">
                          <Badge badgeContent={this.numUnread()} color="secondary">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                        <IconButton
                          aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                          aria-haspopup="true"
                          onClick={this.handleAccountMenuOpen}
                          color="inherit"
                        >
                          <AccountCircle />
                        </IconButton>
                      </Fragment>
                    : <Fragment>
                        <IconButton
                          component={Link}
                          to="/signup"
                          color="inherit">
                          Sign Up
                        </IconButton>
                        <IconButton
                          component={Link}
                          to="/login"
                          color="inherit"
                        >
                          Log In
                        </IconButton>
                      </Fragment>
                  }

                </div>
                <div className={classes.sectionMobile}>
                  <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                    <MoreIcon />
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Header));
