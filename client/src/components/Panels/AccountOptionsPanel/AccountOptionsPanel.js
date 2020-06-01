import React from 'react';
import classes from './AccountOptionsPanel.module.css';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';

const AccountOptionsPanel = React.forwardRef((props, ref) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpacity" mountOnEnter unmountOnExit>
    <div className={classes.Panel} ref={ref}>
      <div onClick={props.logout}>Logout</div>
    </div>
  </CSSTransition>
));

export default AccountOptionsPanel;
