import React from 'react';
import classes from './ErrorPanel.module.css';
import { xIcon } from '../../UIIcons';
import Panel from '../../PanelContainer/PanelContainer';

const ErrorPanel = props => (
  <Panel show={props.show}>
    <div className={classes.ErrorPanelTitle}>
      {props.errorMsg}
      <span onClick={props.close}>{xIcon}</span>
    </div>
  </Panel>
);

export default ErrorPanel;
