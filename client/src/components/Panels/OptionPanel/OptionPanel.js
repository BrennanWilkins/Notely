import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import classes from './OptionPanel.module.css';

const OptionPanel = React.forwardRef((props, ref) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpacity" mountOnEnter unmountOnExit>
    <div className={classes.OptionsPanel} ref={ref}>
      <div onClick={props.toggleShortcut}>{props.shortcutText}</div>
      <div onClick={props.moveTo}>Move to...</div>
      <div onClick={props.delete}>Delete note</div>
      <div onClick={props.duplicate}>Duplicate note</div>
    </div>
  </CSSTransition>
));

export default OptionPanel;
