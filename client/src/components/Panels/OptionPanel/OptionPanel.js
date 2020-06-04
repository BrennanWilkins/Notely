import React from 'react';
import Panel from '../OptionPanelContainer/OptionPanelContainer';

const OptionPanel = React.forwardRef((props, ref) => (
  <Panel ref={ref} height="135px" show={props.show}>
    <div onClick={props.toggleShortcut}>{props.shortcutText}</div>
    <div onClick={props.moveTo}>Move to...</div>
    <div onClick={props.delete}>Delete note</div>
    <div onClick={props.duplicate}>Duplicate note</div>
  </Panel>
));

export default OptionPanel;
