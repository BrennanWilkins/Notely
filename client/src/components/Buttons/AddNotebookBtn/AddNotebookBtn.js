import React from 'react';
import classes from './AddNotebookBtn.module.css';
import { notebookIcon, plusSign } from '../../UIIcons';

const AddNotebookBtn = props => (
  <div onClick={props.addNotebook} className={props.collapse ? classes.AddNotebookCollapse : classes.AddNotebook}
  onMouseOver={props.collapse ? props.showPopup.bind(this, 'New Notebook') : null}
  onMouseLeave={props.collapse ? props.hidePopup : null}>
    <span className={classes.AddNotebookIcon}>
      {notebookIcon}
      <span className={classes.AddNotebookPlus}>{plusSign}</span>
    </span>
    {props.collapse ? null : <span className={classes.NotebookText}>New notebook</span>}
  </div>
);

export default AddNotebookBtn;
