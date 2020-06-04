import React from 'react';
import Panel from '../OptionPanelContainer/OptionPanelContainer';

const TrashOptionPanel = React.forwardRef((props, ref) => (
  <Panel show={props.show} height="90px" ref={ref}>
    <div onClick={props.restore}>Restore</div>
    <div onClick={props.delete}>Delete permanently</div>
  </Panel>
));

export default TrashOptionPanel;
