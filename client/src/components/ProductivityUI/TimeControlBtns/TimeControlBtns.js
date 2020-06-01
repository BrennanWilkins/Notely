import React from 'react';
import classes from './TimeControlBtns.module.css';

const TimeControlBtns = (props) => (
  <div className={classes.ControlBtns}>
    <button onClick={props.reset}>{props.resetText}</button>
    <button onClick={props.start}>{props.startText}</button>
  </div>
);

export default TimeControlBtns;
