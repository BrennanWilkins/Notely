import React from 'react';
import classes from './Wrapper.module.css';
import Header from '../ProductivityHeader/ProductivityHeader';

const Wrapper = props => {
  const contentClass = props.expanded ? classes.ContentExpanded : classes.ContentContracted;
  const containerClass = props.expanded ? classes.Expanded : props.collapse ? classes.Collapsed : classes.Contracted;
  return (
    <div className={containerClass}>
      <Header expanded={props.expanded} expand={props.expand} title={props.title} />
      <div className={contentClass}>
        {props.children}
      </div>
    </div>
  );
};

export default Wrapper;
