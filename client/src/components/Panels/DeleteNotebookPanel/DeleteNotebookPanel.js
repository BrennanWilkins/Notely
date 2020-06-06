import React from 'react';
import { xIcon } from '../../UIIcons';
import classes from './DeleteNotebookPanel.module.css';
import Panel from '../../PanelContainer/PanelContainer';

const DeleteNotebookPanel = props => (
  <Panel show={props.show}>
    <div className={classes.DeleteNotebookTitle}>
      Delete notebook
      <div>
        <button onClick={props.confirmDelete} className={classes.DeleteNotebookBtn}>Delete</button>
        <span onClick={props.delete}>{xIcon}</span>
      </div>
    </div>
    <div className={classes.DeleteNotebookBody}>
      <span>
        All of the notes in <span className={classes.DeleteNotebookBodyTitle}>"{props.title}</span>" will be moved to trash.
      </span>
    </div>
  </Panel>
);

export default DeleteNotebookPanel;
