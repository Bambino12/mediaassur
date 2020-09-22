import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]:{
      justifyContent: 'space-between',
    },
    overflowX: 'auto',
  },
  link:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin:theme.spacing(0,1),
    padding:theme.spacing(1),
    whiteSpace: 'nowrap'
  },
}));

export default function SecondTopbar() {
  const classes = useStyles();
  return (
    <Typography className={classes.root}>
      <Link
        className={classes.link}
        color="inherit"
        component={RouterLink} 
        smooth
        to="/"
      >
        Accueil
      </Link>
      <Link
        className={classes.link}
        color="inherit"
        component={RouterLink} 
        smooth
        to="/Lot"
      >
        Lots d'attestations
      </Link>
      <Link
        className={classes.link}
        color="inherit"
        component={RouterLink} 
        smooth
        to="/Reporting"
      >
        Reporting
      </Link>
    </Typography>
  );
}
