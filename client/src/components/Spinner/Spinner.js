import React from 'react';
import classes from './Spinner.module.css';

const Spinner = props => (
  <div className={props.auth ? classes.AuthLoader : classes.Loader}>Loading...</div>
);

export default Spinner;
