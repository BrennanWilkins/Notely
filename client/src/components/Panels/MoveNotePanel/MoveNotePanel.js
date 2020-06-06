import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import { xIcon, notebookIcon } from '../../UIIcons';
import classes from './MoveNotePanel.module.css';

const MoveNotePanel = (props) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.MoveToPanel}>
      <div className={classes.MoveToPanelTitle}>
        Move note to...
        <div>
          <button onClick={props.confirm} disabled={props.id === null}
          className={classes.MoveToBtn}>Move</button>
          <span onClick={props.close}>{xIcon}</span>
        </div>
      </div>
      <div className={classes.MoveToPanelNotebooks}>
        {props.notebooks.map(notebook => {
          let divClass;
          if (props.id === null) {
            divClass = props.currentId === notebook.id ? classes.ActiveNotebook : classes.InactiveNotebook;
          } else {
            divClass = props.id === notebook.id ? classes.ActiveNotebook : classes.InactiveNotebook;
          }
          return (
            <div onClick={props.move.bind(this, notebook.id)} key={notebook.id} className={divClass}>
              <span className={classes.MoveToPanelNotebooksIcon}>{notebookIcon}</span>
              <span className={classes.MoveToPanelNotebooksText}>{notebook.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  </CSSTransition>
);

export default MoveNotePanel;
