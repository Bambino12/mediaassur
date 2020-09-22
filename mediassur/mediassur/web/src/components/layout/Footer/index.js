import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(1),
    marginTop: 'auto',
    backgroundColor:'#0174DF',// theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
    color: 'white'
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="inherit" align="center">
          {' © Copyright '}
          {new Date().getFullYear()}  
          {' Mediassur '}
          {' | '}
          {'Tous droits reservés'}
        </Typography>
      </Container>
    </footer>
  );
}