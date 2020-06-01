import React from 'react';
import classes from './ProductivityHeader.module.css';
import { contractBtn, expandBtn } from '../../UIIcons';

const ProductivityHeader = props => {
  const expandDetailBtn = props.expanded ? contractBtn : expandBtn;
  return (
    <div className={classes.DetailHeader}>
      <div className={classes.HeaderBtns}>
        <button className={classes.ExpandBtn} onClick={props.expand}>{expandDetailBtn}</button>
      </div>
      <h1>{props.title}</h1>
    </div>
  );
};

export default ProductivityHeader;
