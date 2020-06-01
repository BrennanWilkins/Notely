import React from 'react';
import classes from './NavBarPopup.module.css';

const NavBarPopup = props => {
  const popupClass = props.showPopup ? classes.ShowPopup : classes.HidePopup;
  const popupDivClass = props.collapse ? classes.PopupDivCollapse : classes.PopupDiv;
  // set the position of the popup based on which button is being hovered
  const style = props.popupText === 'Collapse Sidebar' || props.popupText === 'Expand Sidebar' ? { top: '574px' } :
  props.popupText === 'All Notes' ? { top: '224px', width: '60px' } :
  props.popupText === 'Account' ? { top: '46px', width: '60px' } :
  props.popupText === 'New Notebook' ? { top: '85px' } :
  props.popupText === 'Search' ? { top: '124px', width: '50px' } :
  props.popupText === 'New Note' ? { top: '171px', width: '60px' } :
  props.popupText === 'Trash' ? { top: '313px', width: '50px' } :
  props.popupText === 'Back to login' ? { top: '50px' } :
  props.popupText === 'Productivity Tools' ? { top: '370px' } : null;
  return (
    <div className={popupDivClass}>
      <span className={popupClass} style={style}>{props.popupText}</span>
    </div>
  );
};

export default NavBarPopup;
