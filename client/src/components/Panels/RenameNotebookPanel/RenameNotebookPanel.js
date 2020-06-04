import React from 'react';
import classes from './RenameNotebookPanel.module.css';
import { xIcon } from '../../UIIcons';
import Panel from '../../PanelContainer/PanelContainer';

const RenameNotebookPanel = props => (
  <Panel show={props.show} height="200px">
    <div className={classes.RenameNotebookTitle}>
      Rename notebook
      <span onClick={props.close}>{xIcon}</span>
      <button onClick={props.confirm} disabled={props.text === ''}
      className={classes.RenameNotebookBtn}>Rename</button>
    </div>
    <input className={classes.RenameNotebookInput} maxLength="100" autoFocus type="text" value={props.text}
    onChange={props.changeText} placeholder="Notebook name" />
  </Panel>
);

export default RenameNotebookPanel;
