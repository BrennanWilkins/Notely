import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import classes from './RenameNotebookPanel.module.css';
import { xIcon } from '../../UIIcons';

const RenameNotebookPanel = props => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.RenameNotebook}>
      <div className={classes.RenameNotebookTitle}>
        Rename notebook
        <span onClick={props.close}>{xIcon}</span>
        <button onClick={props.confirm} disabled={props.text === ''}
        className={classes.RenameNotebookBtn}>Rename</button>
      </div>
      <input className={classes.RenameNotebookInput} maxLength="100" autoFocus type="text" value={props.text}
      onChange={props.changeText} placeholder="Notebook name" />
    </div>
  </CSSTransition>
);

export default RenameNotebookPanel;
