import React from 'react';
import classes from './AddNotebookPanel.module.css';
import { xIcon } from '../../UIIcons';
import Panel from '../../PanelContainer/PanelContainer';

const AddNotebookPanel = props => (
  <Panel show={props.show} height="200px">
    <div className={classes.AddNotebookTitle}>
      Create new notebook
      <span onClick={props.close}>{xIcon}</span>
      <button onClick={props.confirm} disabled={props.changeText === ''}
      className={classes.AddNotebookBtn}>Create</button>
    </div>
    <span className={classes.AddNotebookSubheader}>Notebooks allow you to group notes around a common topic.</span>
    <input className={classes.AddNotebookInput} maxLength="100" autoFocus type="text" value={props.notebookText}
    onChange={props.changeText} placeholder="Notebook name" />
  </Panel>
);

export default AddNotebookPanel;
