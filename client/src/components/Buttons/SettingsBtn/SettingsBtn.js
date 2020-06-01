import React from 'react';
import classes from './SettingsBtn.module.css';
import { settingsIcon } from '../../UIIcons';

const SettingsBtn = props => (
  <div onClick={props.show} className={classes.SettingsBtn}>
    <div className={classes.SettingsIcon}>{settingsIcon}</div>
    <span className={classes.SettingsPopup}>Notebook Settings</span>
  </div>
);

export default SettingsBtn;
