import React from 'react';
import classes from './ProductivityHeader.module.css';
import { contractBtn, expandBtn } from '../../UIIcons';

const ProductivityHeader = props => (
  <div className={classes.DetailHeader}>
    <div className={classes.HeaderBtn}>
      <button className={classes.ExpandBtn} onClick={props.expand}>
        <span>{props.expanded ? contractBtn : expandBtn}</span>
      </button>
    </div>
    <div className={classes.Title}><h1>{props.title}</h1></div>
  </div>
);

export default ProductivityHeader;
