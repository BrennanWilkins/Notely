import React from 'react';
import classes from './SettingsOptionsPanel.module.css';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';

const SettingsOptionsPanel = React.forwardRef((props, ref) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpacity" mountOnEnter unmountOnExit>
    <div className={classes.SettingsPanel} ref={ref}>
      <div onClick={props.rename}>Rename notebook</div>
      <div onClick={props.delete}>Delete notebook</div>
      <div onClick={props.setDefault}>Set as default notebook</div>
    </div>
  </CSSTransition>
));

export default SettingsOptionsPanel;
