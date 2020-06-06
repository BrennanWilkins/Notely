import React from 'react';
import { xIcon } from '../../UIIcons';
import classes from './DeleteNotePanel.module.css';
import Panel from '../../PanelContainer/PanelContainer';

const DeleteNotePanel = (props) => (
  <Panel show={props.show}>
    <div className={classes.DeleteNotePanelTitle}>
      Delete note
      <div>
        <button onClick={props.confirm} className={classes.DeleteNoteBtn}>Delete</button>
        <span onClick={props.close}>{xIcon}</span>
      </div>
    </div>
    <div className={classes.DeleteNoteBody}>
      <span>
        The note <span className={classes.DeleteNoteBodyTitle}>"{props.title}</span>" will be moved to trash.
      </span>
    </div>
  </Panel>
);

export default DeleteNotePanel;
