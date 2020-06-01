import React from 'react';
import classes from './NavBarPanel.module.css';
import { notebookIcon, star } from '../../UIIcons';
import { EditorState, convertFromRaw } from 'draft-js';

const NavBarPanel = React.forwardRef((props, ref) => {
  const PanelClass = props.show ? classes.ShowPanel : classes.HidePanel;
  const goToHandler = (id) => {
    if (props.isNotebook) { return props.goToNotebook(id); }
    return props.goToShortcut(id);
  }
  const links = props.links.map(link => {
    const linkTitle = props.isNotebook ? link.title :
    (EditorState.createWithContent(convertFromRaw(JSON.parse(link.title)))).getCurrentContent().getPlainText();
    return (
      <div onClick={() => goToHandler(link.id)} className={classes.NavLink} key={link.id}>
        <span className={classes.Icon}>{props.isNotebook ? notebookIcon : star}</span>
        <span className={classes.Text}>{linkTitle}</span>
      </div>
    );
  });
  return (
    <div className={PanelClass} ref={ref} onMouseLeave={props.panelLeave}>
      <div className={classes.Title}>{props.isNotebook ? 'Notebooks' : 'Shortcuts'}</div>
      <div className={classes.NavLinks}>
        {links}
      </div>
    </div>
  );
});

export default NavBarPanel;
