import React from 'react';
import classes from './PointerArrow.module.css';
import { arrowIcon } from '../UIIcons';

const PointerArrow = props => {
  const arrowClass = props.demo ? classes.DemoArrow : classes.Arrow;
  return (
    <span className={arrowClass}>
      {arrowIcon}
    </span>
  );
};

export default PointerArrow;
