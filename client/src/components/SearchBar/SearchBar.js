import React from 'react';
import classes from './SearchBar.module.css';
import { searchIcon, xIconFilled } from '../UIIcons';

const SearchBar = props => {
  const searchClass = props.value === '' ? classes.SearchInactive : classes.SearchActive;
  const xIconClass = props.value !== '' ? classes.XIconActive : classes.XIconInactive;
  return (
    <div className={searchClass}>
      <span>{searchIcon}</span>
      <input type="text" placeholder="Search" value={props.value} onKeyPress={props.send}
      onChange={props.set} autoFocus={props.wasExpanded} />
      <button onClick={props.clear} className={xIconClass}>{xIconFilled}</button>
    </div>
  );
};

export default SearchBar;
