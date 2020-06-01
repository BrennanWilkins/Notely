import React from 'react';
import classes from './TimeDisplay.module.css';

const TimeDisplay = (props) => (
  <div className={classes.TimeDiv}>{props.time}</div>
);

export default TimeDisplay;
