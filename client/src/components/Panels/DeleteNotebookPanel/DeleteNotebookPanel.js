import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import { xIcon } from '../../UIIcons';
import classes from './DeleteNotebookPanel.module.css';

const DeleteNotebookPanel = props => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.DeleteNotebook}>
      <div className={classes.DeleteNotebookTitle}>
        Delete notebook
        <span onClick={props.delete}>{xIcon}</span>
        <button onClick={props.confirmDelete} className={classes.DeleteNotebookBtn}>Delete</button>
      </div>
      <div className={classes.DeleteNotebookBody}>
        <span>
          All of the notes in "<span className={classes.DeleteNotebookBodyTitle}>{props.title}</span>" will be moved to trash.
        </span>
      </div>
    </div>
  </CSSTransition>
);

export default DeleteNotebookPanel;
