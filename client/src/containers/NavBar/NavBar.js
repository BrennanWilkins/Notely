import React, { Component } from 'react';
import classes from './NavBar.module.css';
import { chevronDown, star, page2, notebookIcon, trashIcon, caretRight, person, searchIcon, clockIcon,
  stopwatchIcon, timerIcon, pomodoroIcon } from '../../components/UIIcons';
import { EditorState, convertFromRaw } from 'draft-js';
import AddNotebookBtn from '../../components/Buttons/AddNotebookBtn/AddNotebookBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import NewNoteBtn from '../../components/Buttons/NewNoteBtn/NewNoteBtn';
import AccountOptionsPanel from '../../components/Panels/AccountOptionsPanel/AccountOptionsPanel';
import CollapseBtn from '../../components/Buttons/CollapseBtn/CollapseBtn';
import BackToLoginBtn from '../../components/Buttons/BackToLoginBtn/BackToLoginBtn';
import PointerArrow from '../../components/PointerArrow/PointerArrow';

class NavBar extends Component {
  state = {
    showShortcuts: false,
    showNotebooks: false,
    showSettingsPanel: false,
    wasExpanded: false,
    showProductivity: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    for (let state in nextState) {
      if (this.state[state] !== nextState[state]) { return true; }
    }
    for (let prop in nextProps) {
      if (this.props[prop] !== nextProps[prop]) { return true; }
    }
    return false;
  }

  showShortcuts = () => {
    this.setState(prevState => { return { showShortcuts: !prevState.showShortcuts }});
  }

  showNotebooks = () => {
    this.setState(prevState => { return { showNotebooks: !prevState.showNotebooks }});
  }

  showProductivity = () => {
    this.setState(prevState => { return { showProductivity: !prevState.showProductivity }});
  }

  sendSearchValue = (e) => {
    // if no notebooks cant search
    if (this.props.notebooks.length === 0) { return; }
    // if user presses enter key then set the confirmed search value
    if (e.which === 13 || e.keyCode === 13) {
      this.props.goToSearch();
    }
  }

  // opens/closes the settings panel for account options
  showSettingsPanelHandler = () => {
    if (!this.state.showSettingsPanel) {
      document.addEventListener('click', this.handleSettingsOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleSettingsOutsideClick, false);
    }
    this.setState(prevState => { return { showSettingsPanel: !prevState.showSettingsPanel }});
  }

  handleSettingsOutsideClick = (e) => {
    // if panel clicked inside return, else close panel if outside click
    if (this.settingsPanel === e.target) { return; }
    this.showSettingsPanelHandler();
  }

  // remove outside click listener before unmounting
  componentWillUnmount() {
    document.removeEventListener('click', this.handleSettingsOutsideClick, false);
    document.removeEventListener('click', this.handleNavBarOutsideClick, false);
  }

  // expands nav bar
  expandHandler = () => {
    this.setState({ wasExpanded: true });
    this.props.collapseHandler();
  }

  // collapses nav bar
  collapseHandler = () => {
    this.setState({ wasExpanded: false });
    this.props.collapseHandler();
  }

  // expands nav bar & shows the productivity tools
  productivityExpand = () => {
    this.setState({ showProductivity: true });
    this.props.collapseHandler();
    this.props.hidePopup();
  }

  showNavBarHandler = () => {
    // wait 100ms before checking again
    setTimeout(() => {
      if (window.innerWidth < 751 && !this.props.collapse) {
        document.addEventListener('click', this.handleNavBarOutsideClick, false);
      }
    }, 100);
  }

  // if nav bar clicked then return else close the nav bar on outside click
  handleNavBarOutsideClick = (e) => {
    if (this.navBar.contains(e.target)) { return; }
    document.removeEventListener('click', this.handleNavBarOutsideClick, false);
    this.collapseHandler();
  }

  render() {
    // if viewport width < 751px & navbar is open then add outside click event listener
    if (window.innerWidth < 751 && !this.props.collapse) {
      this.showNavBarHandler();
    }
    const shortcutCaretClass = this.state.showShortcuts ? classes.NavBarCaretDown : classes.NavBarCaretRight;
    const notebookCaretClass = this.state.showNotebooks ? classes.NavBarCaretDown : classes.NavBarCaretRight;
    const productivityCaretClass = this.state.showProductivity ? classes.NavBarCaretDown : classes.NavBarCaretRight;
    const navClass = this.props.expanded ? classes.NavBarClose : this.props.collapse ? classes.NavBarCollapse : classes.NavBar;
    const shortcuts = this.props.shortcuts.map(note => {
      const style = this.state.showShortcuts ? { maxHeight: this.props.shortcuts.length * 30 + 'px' } : {};
      // convert title from draft js format to plain text
      const noteTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(note.title)))).getCurrentContent().getPlainText();
      return (
        <div style={style} onClick={this.props.goToShortcut.bind(this, note.id)} className={classes.NavLinksInner} key={note.id}>
          <span className={classes.InnerIcons}>{page2}</span>
          <span className={classes.InnerText}>{noteTitle}</span>
        </div>
      );
    });
    const notebooks = this.props.notebooks.map(notebook => {
      const style = this.state.showNotebooks ? { maxHeight: this.props.notebooks.length * 30 + 'px' } : {};
      return (
        <div style={style} onClick={this.props.goToNotebook.bind(this, notebook.id)} className={classes.NavLinksInner} key={notebook.id}>
          <span className={classes.InnerIcons}>{notebookIcon}</span>
          <span className={classes.InnerText}>{notebook.title}</span>
        </div>
      );
    });
    const navTitleClass = this.props.demo ? classes.DemoTitle : classes.Title;
    // if in demo mode then show button to go back to login else show account settings panel
    const accountNav = this.props.demo ?
    <BackToLoginBtn collapse={this.props.collapse} showPopup={this.props.showPopup} hidePopup={this.props.hidePopup} />
    : ( this.props.collapse ?
      <React.Fragment>
        <button className={classes.AccountBtn} onClick={this.showSettingsPanelHandler}
        onMouseEnter={this.props.showPopup.bind(this, 'Account')} onMouseLeave={this.props.hidePopup}>
          <span className={classes.PersonIcon}>{person}</span>
        </button>
        <AccountOptionsPanel ref={settingsPanel => { this.settingsPanel = settingsPanel; }}
        show={this.state.showSettingsPanel} logout={this.props.logout} />
      </React.Fragment> :
      <React.Fragment>
        <div className={classes.UserInfo}>
          <button onClick={this.showSettingsPanelHandler}>
            <span>{localStorage['email']}</span>
            <div>{chevronDown}</div>
          </button>
        </div>
        <AccountOptionsPanel ref={settingsPanel => { this.settingsPanel = settingsPanel; }}
        show={this.state.showSettingsPanel} logout={this.props.logout} />
      </React.Fragment>
    );
    // show collapsed navbar or expanded nav bar
    const content = this.props.collapse ? (
      <React.Fragment>
        <div className={navTitleClass}></div>
        {accountNav}
        <AddNotebookBtn addNotebook={this.props.addNotebook} collapse showPopup={this.props.showPopup} hidePopup={this.props.hidePopup}/>
        <div className={classes.ContractSearchIcon}>
          <span onMouseLeave={this.props.hidePopup} onClick={this.expandHandler}
          onMouseEnter={this.props.showPopup.bind(this, 'Search')}>
            {searchIcon}
          </span>
        </div>
        <NewNoteBtn collapse newNote={this.props.newNote} showPopup={this.props.showPopup} hidePopup={this.props.hidePopup}/>
        <div className={classes.NavLinksCollapse}>
          <div onClick={this.props.showAllNotes} onMouseEnter={this.props.showPopup.bind(this, 'All Notes')}
          onMouseLeave={this.props.hidePopup}>
            <span>{page2}</span>
          </div>
          <div onMouseEnter={this.props.showShortcuts} onMouseLeave={this.props.hideShortcuts}><span>{star}</span></div>
          <div onMouseEnter={this.props.showNotebooks} onMouseLeave={this.props.hideNotebooks}><span>{notebookIcon}</span></div>
          <div onClick={this.props.showTrash} onMouseEnter={this.props.showPopup.bind(this, 'Trash')}
          onMouseLeave={this.props.hidePopup}><span>{trashIcon}</span></div>
          <div onMouseEnter={this.props.showPopup.bind(this, 'Productivity Tools')} onMouseLeave={this.props.hidePopup}
          style={{ marginTop: '25px' }} onClick={this.productivityExpand}>
            <span>{clockIcon}</span>
          </div>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className={navTitleClass}>Notely</div>
        {accountNav}
        <AddNotebookBtn addNotebook={this.props.addNotebook} />
        {this.props.showArrow ? <PointerArrow demo={this.props.demo} /> : null}
        <SearchBar value={this.props.searchValue} send={this.sendSearchValue} set={this.props.setSearchValue}
        clear={this.props.clearSearch} wasExpanded={this.state.wasExpanded}/>
        <NewNoteBtn newNote={this.props.newNote} />
        <div className={classes.NavLinks}>
          <div onClick={this.props.showAllNotes} className={classes.NavLinksOuter}>
            <span style={{paddingLeft: '28px'}}>{page2}</span>
            All Notes
          </div>
          <div className={classes.NavLinksOuter} onClick={this.showShortcuts}>
            <span style={{marginLeft: '10px'}} className={[shortcutCaretClass, classes.NavBarCaret].join(' ')}>{caretRight}</span>
            <span>{star}</span>Shortcuts
          </div>
          {shortcuts}
          <div className={classes.NavLinksOuter} onClick={this.showNotebooks}>
            <span style={{marginLeft: '10px'}} className={[notebookCaretClass, classes.NavBarCaret].join(' ')}>{caretRight}</span>
            <span>{notebookIcon}</span>Notebooks
          </div>
          {notebooks}
          <div onClick={this.props.showTrash} className={classes.NavLinksOuter}>
            <span style={{paddingLeft: '28px'}}>{trashIcon}</span>Trash
          </div>
          <div className={classes.NavLinksOuter} onClick={this.showProductivity} style={{ marginTop: '25px' }}>
            <span style={{marginLeft: '10px'}} className={[productivityCaretClass, classes.NavBarCaret].join(' ')}>{caretRight}</span>
            <span>{clockIcon}</span>Productivity
          </div>
          <div style={this.state.showProductivity ? { maxHeight: '80px' } : {}}
          onClick={this.props.goToStopwatch} className={classes.NavLinksInner}>
            <span className={classes.InnerIcons}>{stopwatchIcon}</span>
            <span className={classes.InnerText}>Stopwatch</span>
          </div>
          <div style={this.state.showProductivity ? { maxHeight: '80px' } : {}}
          onClick={this.props.goToTimer} className={classes.NavLinksInner}>
            <span className={classes.InnerIcons}>{timerIcon}</span>
            <span className={classes.InnerText}>Timer</span>
          </div>
          <div style={this.state.showProductivity ? { maxHeight: '80px' } : {}}
          onClick={this.props.goToPomodoro} className={classes.NavLinksInner}>
            <span className={classes.InnerIcons}>{pomodoroIcon}</span>
            <span className={classes.InnerText}>Pomodoro Timer</span>
          </div>
        </div>
      </React.Fragment>
    );
    return (
      <div className={navClass} ref={navBar => { this.navBar = navBar; }}>
        {content}
        <CollapseBtn setCollapse={this.collapseHandler} showPopup={this.props.showPopup} hidePopup={this.props.hidePopup}
        collapse={this.props.collapse} />
      </div>
    );
  }
}

export default NavBar;
