import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';
import classes from './TrashOptionPanel.module.css';

const TrashOptionPanel = React.forwardRef((props, ref) => (
  <CSSTransition in={props.show} timeout={400} classNames="PanelOpacity" mountOnEnter unmountOnExit>
    <div className={classes.OptionsPanel} style={{height: '90px'}} ref={ref}>
      <div onClick={props.restore}>Restore</div>
      <div onClick={props.delete}>Delete permanently</div>
    </div>
  </CSSTransition>
));

export default TrashOptionPanel;
