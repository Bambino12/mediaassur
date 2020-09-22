import React from 'react';

import {connect} from "react-redux";

import AppBar from '@material-ui/core/AppBar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import makeStyles from '@material-ui/styles/makeStyles';

import ExpandMore from '@material-ui/icons/ExpandMore';

import { SecondTopbar } from './components'
import { avatar } from 'assets/img/public'

import { logout } from 'redux/actions'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {
	    flexGrow: 1,
	},
	grow: {
	    flexGrow: 1,
	},
	company: {
		cursor: "pointer",
		color: "white",
		fontWeight:"bold",
		fontSize: 20
	},
	avatar: {
		width: 25,
		height: 25,
	},
	logo: {
		width: 70,
		height: 25,
	},
	profileContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		marginRight: 10,
	},
	profile: {
		marginRight: 10,
		cursor: "pointer",
		color: "white",
		fontWeight:"bold",
		fontSize: 16
	},
}));

function Topbar(props) {
	const classes = useStyles();
	const history = useHistory()

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	}
	
	const handleClose = () => {
		setAnchorEl(null);
	}

	return (
	    <ElevationScroll {...props}>
	      	<AppBar color="default" style={{zIndex: 999}}>
		        <Toolbar variant="dense" style={{background: "#0174DF"}}>
			        <div className={classes.company} onClick={() => history.push('/')}>
						Mediassur
			        </div>

		          	<div className={classes.grow} />

					<div className={classes.profileContainer} >
						<Typography 
							color="primary"
							variant="body1"
							className={classes.profile}
							onClick={handleClick}
						>
							{props.user.name}
							<ExpandMore />
						</Typography>

						<Menu
							id="profile"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>Mon profil</MenuItem>
							<MenuItem onClick={handleClose}>Modfier mot de passe</MenuItem>
							<MenuItem onClick={props.logout}>Se deconnecter</MenuItem>
						</Menu>
						<img
							alt=''
							className={classes.avatar}
							src={avatar}
						/>
					</div>
					
		        </Toolbar>
		        <SecondTopbar/>
	      	</AppBar>
	    </ElevationScroll>
	);
}

const mapStateToProps = (state) => {
    return {
      user: state.auth.user
    }
}

export default connect(mapStateToProps, {logout})(Topbar);
  
function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 2 : 0,
  });
}
