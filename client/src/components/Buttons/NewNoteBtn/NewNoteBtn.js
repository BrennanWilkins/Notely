import React from 'react';
import classes from './NewNoteBtn.module.css';
import { plusSignFilled } from '../../UIIcons';

const NewNoteBtn = props => (
  <div onClick={props.newNote} className={props.collapse ? classes.CollapseBtn : classes.Btn}>
    <button className={classes.PlusBtn}>
      <span onMouseOver={props.collapse ? props.showPopup.bind(this, 'New Note') : null}
      onMouseLeave={props.collapse ? props.hidePopup : null}>
        {plusSignFilled}
      </span>
      {props.collapse ? null : <div>New Note</div>}
    </button>
  </div>
);

export default NewNoteBtn;
