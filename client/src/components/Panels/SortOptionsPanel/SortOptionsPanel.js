import React from 'react';
import classes from './SortOptionsPanel.module.css';
import { CSSTransition } from 'react-transition-group';
import '../../../popupAnims.css';

const SortOptionsPanel = React.forwardRef((props, ref) => {
  const highlighted = {color: 'rgb(104, 136, 252)'};
  const normal = {color: 'black'};
  // set the currently selected sort option to be highlighted
  const cmStyle = props.sortStyle === 'Created Most' ? highlighted : normal;
  const clStyle = props.sortStyle === 'Created Least' ? highlighted : normal;
  const umStyle = props.sortStyle === 'Updated Most' ? highlighted : normal;
  const ulStyle = props.sortStyle === 'Updated Least' ? highlighted : normal;
  const taStyle = props.sortStyle === 'Title A' ? highlighted : normal;
  const tzStyle = props.sortStyle === 'Title Z' ? highlighted : normal;
  return (
    <CSSTransition in={props.show} timeout={400} classNames="PanelOpacity" mountOnEnter unmountOnExit>
      <div className={classes.SortPanel} ref={ref}>
        <span className={classes.SortPanelTitle}>SORT BY...</span>
        <div style={cmStyle} onClick={props.sort.bind(this, 'Created Most')}>Date created: Most to least recent</div>
        <div style={clStyle} onClick={props.sort.bind(this, 'Created Least')}>Date created: Least to most recent</div>
        <div style={umStyle} onClick={props.sort.bind(this, 'Updated Most')}>Date updated: Most to least recent</div>
        <div style={ulStyle} onClick={props.sort.bind(this, 'Updated Least')}>Date updated: Least to most recent</div>
        <div style={taStyle} onClick={props.sort.bind(this, 'Title A')}>Title: A to Z</div>
        <div style={tzStyle} onClick={props.sort.bind(this, 'Title Z')}>Title: Z to A</div>
      </div>
    </CSSTransition>
  );
});

export default SortOptionsPanel;
