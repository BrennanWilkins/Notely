import React from 'react';
import classes from './PointerArrow.module.css';
import { arrowIcon } from '../UIIcons';

const PointerArrow = props => (
  <span className={classes.Arrow}>
    {arrowIcon}
  </span>
);

export default PointerArrow;
