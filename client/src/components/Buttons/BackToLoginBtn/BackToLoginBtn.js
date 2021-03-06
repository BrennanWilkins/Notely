import React from 'react';
import classes from './BackToLoginBtn.module.css';
import { personPlus } from '../../UIIcons';
import { Link } from 'react-router-dom';

const BackToLoginBtn = props => (
  <Link to="/login" className={props.collapse ? classes.LinkCollapse : classes.Link}>
    <span className={classes.BtnSpan}>
      <button className={props.collapse ? classes.ButtonCollapse : classes.Button}
      onMouseEnter={props.collapse ? () => props.showPopup('Back to login') : null}
      onMouseLeave={props.collapse ? props.hidePopup : null}>
        <span>{personPlus}</span>
        {props.collapse ? '' : 'Back to Login'}
      </button>
    </span>
  </Link>
);

export default BackToLoginBtn;
