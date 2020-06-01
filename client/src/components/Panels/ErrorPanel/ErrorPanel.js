import React from 'react';
import classes from './ErrorPanel.module.css';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import { xIcon } from '../../UIIcons';

const ErrorPanel = props => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.ErrorPanel}>
      <div className={classes.ErrorPanelTitle}>
        {props.errorMsg}
        <span onClick={props.close}>{xIcon}</span>
      </div>
    </div>
  </CSSTransition>
);

export default ErrorPanel;
