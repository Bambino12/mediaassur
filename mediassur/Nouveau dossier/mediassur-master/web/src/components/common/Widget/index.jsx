import React from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Component styles
import styles from './styles';

function  Widget(props){
  const { classes, className, label, total, icon, ...rest } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <Paper
      {...rest}
      className={rootClassName}
    >
      <div className={classes.content}>
        <div className={classes.details}>
          <Typography
            className={classes.title}
            variant="body2"
          >
            {label}
          </Typography>
          <Typography
            className={classes.value}
            variant="h6"
          >
            {total}
          </Typography>
        </div>
        <div className={classes.iconWrapper}>
          {icon}
        </div>
      </div>
      <div className={classes.footer}>
        <Typography
          className={classes.caption}
          variant="caption"
        >
        
        </Typography>
      </div>
    </Paper>
  );
}

Widget.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Widget);
