import React from 'react';
import { xIcon } from '../../UIIcons';
import classes from './DeleteNotePanel.module.css';
import Panel from '../../PanelContainer/PanelContainer';

const DeleteNotePanel = (props) => (
  <Panel show={props.show} height="150px">
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
  </Panel>
);

export default DeleteNotePanel;
