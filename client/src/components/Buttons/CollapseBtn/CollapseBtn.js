import React from 'react';
import classes from './CollapseBtn.module.css';
import { chevronDoubleLeft } from '../../UIIcons';

const CollapseBtn = props => {
  const btnClass = props.collapse ? classes.CollapseBtn : classes.ExpandBtn;
  const showPopup = () => {
    if (props.collapse) { return props.showPopup('Expand Sidebar'); }
    return props.showPopup('Collapse Sidebar');
  };
  return (
    <div onClick={props.setCollapse} className={btnClass} onMouseOver={showPopup} onMouseLeave={props.hidePopup}>
      <span>{chevronDoubleLeft}</span>
    </div>
  );
};

export default CollapseBtn;
