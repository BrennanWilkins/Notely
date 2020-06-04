import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import classes from './OptionPanelContainer.module.css';

const OptionPanelContainer = React.forwardRef((props, ref) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpacity" mountOnEnter unmountOnExit>
    <div ref={ref} className={classes.OptionsPanel} style={{ height: props.height }}>
      {props.children}
    </div>
  </CSSTransition>
));

export default OptionPanelContainer;
