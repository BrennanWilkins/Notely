import React from 'react';
import classes from './SortBtn.module.css';
import { sortIcon } from '../../UIIcons';

const SortBtn = props => (
  <div onClick={props.show} className={classes.SortBtn}>
    {sortIcon}
    <span className={classes.SortPopup}>Sort Options</span>
  </div>
);

export default SortBtn;
