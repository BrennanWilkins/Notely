import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import classes from './AddNotebookPanel.module.css';
import { xIcon } from '../../UIIcons';

const AddNotebookPanel = props => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.AddNotebook}>
      <div className={classes.AddNotebookTitle}>
        Create new notebook
        <span onClick={props.close}>{xIcon}</span>
        <button onClick={props.confirm} disabled={props.changeText === ''}
        className={classes.AddNotebookBtn}>Create</button>
      </div>
      <span className={classes.AddNotebookSubheader}>Notebooks allow you to group notes around a common topic.</span>
      <input className={classes.AddNotebookInput} maxLength="100" autoFocus type="text" value={props.notebookText}
      onChange={props.changeText} placeholder="Notebook name" />
    </div>
  </CSSTransition>
);

export default AddNotebookPanel;
