import React from 'react';
import { Link } from "react-router-dom";

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import withStyles from '@material-ui/styles/withStyles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

// Component styles
import styles from './styles';

function CustomersToolbar(props) {
  const { classes, className } = props;

  const rootClassName = classNames(classes.root, className);
  
  return (
    <div className={rootClassName}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link to="/clients">
        <Typography variant='body1'>clients</Typography>
        </Link>
        <Typography variant='body1'>ajouter</Typography>
      </Breadcrumbs>
    </div>
  );
}

CustomersToolbar.propTypes = {
  className: PropTypes.string,
};

export default  withStyles(styles)(CustomersToolbar);
