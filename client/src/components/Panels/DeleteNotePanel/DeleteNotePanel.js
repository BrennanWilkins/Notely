import React from 'react';
import { xIcon } from '../../UIIcons';
import '../../../popupAnims.css';
import classes from './DeleteNotePanel.module.css';
import { CSSTransition } from 'react-transition-group';

const DeleteNotePanel = (props) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.DeleteNotePanel}>
      <div className={classes.DeleteNotePanelTitle}>
        Delete note
        <span onClick={props.close}>{xIcon}</span>
        <button onClick={props.confirm} className={classes.DeleteNoteBtn}>Delete</button>
      </div>
      <div className={classes.DeleteNoteBody}>
        <span>The note "</span>
        <span className={classes.DeleteNoteBodyTitle}>{props.title}</span>
        <span>" will be moved to trash.</span>
      </div>
    </div>
  </CSSTransition>
);

export default DeleteNotePanel;
