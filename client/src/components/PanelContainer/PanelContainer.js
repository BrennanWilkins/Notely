import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../popupAnims.css';
import classes from './PanelContainer.module.css';

const PanelContainer = props => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpen" mountOnEnter unmountOnExit>
    <div className={classes.Panel} style={{ height: props.height }}>
      {props.children}
    </div>
  </CSSTransition>
);

export default PanelContainer;
