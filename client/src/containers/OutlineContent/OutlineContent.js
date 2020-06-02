import React from 'react';
import classes from './OutlineContent.module.css';
import '../../popupAnims.css';
import { star, searchIcon } from '../../components/UIIcons';
import Highlighter from 'react-highlight-words';
import { EditorState, convertFromRaw } from 'draft-js';
import SettingsOptionsPanel from '../../components/Panels/SettingsOptionsPanel/SettingsOptionsPanel';
import SortOptionsPanel from '../../components/Panels/SortOptionsPanel/SortOptionsPanel';
import SettingsBtn from '../../components/Buttons/SettingsBtn/SettingsBtn';
import SortBtn from '../../components/Buttons/SortBtn/SortBtn';

class Outline extends React.Component {
  state = {
    showSortPanel: false,
    showSettingsPanel: false,
    prevNotebook: null,
    notebook: null
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

  // adds/removes outside click event listener when panel opened/closed
  showSortPanelHandler = () => {
    if (!this.state.showSortPanel) {
      document.addEventListener('click', this.handleSortOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleSortOutsideClick, false);
    }
    this.setState(prevState => { return { showSortPanel: !prevState.showSortPanel }});
  }

  // if sort panel clicked then return, else close the panel on outside click
  handleSortOutsideClick = (e) => {
    if (this.sortPanel.contains(e.target)) { return; }
    this.showSortPanelHandler();
  }

  // adds/removes outside click event listener when panel opened/closed
  showSettingsPanelHandler = () => {
    if (!this.state.showSettingsPanel) {
      document.addEventListener('click', this.handleSettingsOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleSettingsOutsideClick, false);
    }
    this.setState(prevState => { return { showSettingsPanel: !prevState.showSettingsPanel }});
  }

  // if settings panel clicked then return, else close the panel on outside click
  handleSettingsOutsideClick = (e) => {
    if (this.settingsPanel === e.target) { return; }
    this.showSettingsPanelHandler();
  }

  // don't need outside click event listeners once unmounted
  componentWillUnmount() {
    document.removeEventListener('click', this.handleSettingsOutsideClick, false);
    document.removeEventListener('click', this.handleSortOutsideClick, false);
  }

  render() {
    const outlineClass = this.props.collapse ? (!this.props.expanded ? classes.OutlineCollapse : classes.OutlineClose) :
    !this.props.expanded ? classes.Outline : classes.OutlineClose;
    let notebookNotes = this.props.notebookNotes;
    if (notebookNotes !== null) {
      // sort notes by created most to least recently
      if (this.props.sortStyle === 'Created Most') {
        notebookNotes.sort((a, b) => {
          return b.dateCreated.getTime() - a.dateCreated.getTime();
        });
      // sort notes by created least to most recently
      } else if (this.props.sortStyle === 'Created Least') {
        notebookNotes.sort((a, b) => {
          return a.dateCreated.getTime() - b.dateCreated.getTime();
        });
      // sort notes by last updated most to least recently
      } else if (this.props.sortStyle === 'Updated Most') {
        notebookNotes.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
      // sort notes by last updated lease to most recently
      } else if (this.props.sortStyle === 'Updated Least') {
        notebookNotes.sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });
      // sort notes from A to Z
      } else if (this.props.sortStyle === 'Title A') {
        notebookNotes.sort((a, b) => {
          // convert titles from draft js format to plain text
          const aTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(a.title)))).getCurrentContent().getPlainText();
          const bTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(b.title)))).getCurrentContent().getPlainText();
          return aTitle.localeCompare(bTitle);
        });
      // sort notes from Z to A
      } else {
        notebookNotes.sort((a, b) => {
          // convert titles from draft js format to plain text
          const aTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(a.title)))).getCurrentContent().getPlainText();
          const bTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(b.title)))).getCurrentContent().getPlainText();
          return bTitle.localeCompare(aTitle);
        });
      }
    }
    notebookNotes = notebookNotes.map(note => {
      let noteClass = classes.NotebookNote;
      if (this.props.selectedId === note.id) {
        // if note is selected then automatically scroll it into view
        if (this[`note${note.id}`]) {
          this[`note${note.id}`].scrollIntoView(true);
        }
        noteClass = classes.NotebookNoteSelected;
      }
      let date;
      // if note updated less than 59 sec ago
      if (Math.abs(note.date.getTime() - (new Date()).getTime()) <= 59000) {
        date = 'A few seconds ago';
      }
      // if note updated at least 60 sec ago
      if (Math.abs(note.date.getTime() - (new Date()).getTime()) >= 60000) {
        date = 'A few minutes ago';
      }
      // if note updated at least ~28 min ago
      if (Math.abs(note.date.getTime() - (new Date()).getTime()) >= 1700000) {
        date = '30 minutes ago';
      }
      // if note updated at least 60 min ago
      if (Math.abs(note.date.getTime() - (new Date()).getTime()) >= 3600000) {
        date = '1 hour ago';
      }
      // set date from 2 to 23 hours ago since last updated
      for (let i = 2; i < 24; i++) {
        if (Math.abs(note.date.getTime() - (new Date()).getTime()) >= (3600000 * i)) {
          date = i + ' hours ago';
        }
      }
      // if note updated over 24 hours ago then display the date last updated
      if (Math.abs(note.date.getTime() - (new Date()).getTime()) >= 86400000) {
        date = note.date.toDateString().split(' ');
        // if month of date starts w 0 then dont show 0
        if (Number(date[2].split('')[0]) === 0) {
          // if notes year is equal to the current year then dont show the year
          if (String((new Date()).getFullYear()) === String(date[3])) {
            date = `${date[1]} ${date[2].split('')[1]}`;
          } else {
            date = `${date[1]} ${date[2].split('')[1]}, ${date[3]}`;
          }
        } else {
          // if notes year is equal to the current year then dont show the year
          if (String((new Date()).getFullYear()) === String(date[3])) {
            date = `${date[1]} ${date[2]}`;
          } else {
            date = `${date[1]} ${date[2]}, ${date[3]}`;
          }
        }
      }
      // show star next to note if favorited
      const favStar = note.favorite ? <span className={classes.StarIcon}>{star}</span> : null;
      // convert title to plain text
      const noteTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(note.title)))).getCurrentContent().getPlainText();
      // if in search mode then wrap text in highlighter component to highlight matching search words
      let noteTitleText = this.props.onSearch ? (
        <Highlighter highlightClassName={classes.HighlightText} searchWords={[this.props.searchValue]}
        autoEscape={true} textToHighlight={noteTitle} />
      ) : noteTitle;
      if (noteTitle === '') { noteTitleText = 'Untitled'; }
      // convert body to plain text
      const noteBody = (EditorState.createWithContent(convertFromRaw(JSON.parse(note.body)))).getCurrentContent().getPlainText();
      // use Highlighter w body if in search mode
      const noteBodyText = this.props.onSearch ? (
        <Highlighter highlightClassName={classes.HighlightText} searchWords={[this.props.searchValue]}
        autoEscape={true} textToHighlight={noteBody} />
      ) : noteBody;
      // ref added to each note in notebookNotes in order to scroll to it when selected
      return (
        <div ref={refId => { this[`note${note.id}`] = refId; }} onClick={this.props.changeNote.bind(this, note.id)}
        key={note.id} className={noteClass}>
          <div className={classes.NoteTitle}>{noteTitleText}{favStar}</div>
          <div className={classes.NoteBody}>{noteBodyText}</div>
          <div className={classes.NoteDate}>{date}</div>
        </div>
      );
    });
    // only show settingsBtn/sortBtn when a notebook is being displayed
    const settingsBtn = this.props.notebookTitle !== 'Add a notebook!' && this.props.notebookTitle !== 'All Notes' &&
    this.props.notebookTitle !== 'Trash' ? <SettingsBtn show={this.showSettingsPanelHandler} /> : null;
    const sortBtn = this.props.notebookTitle !== 'Add a notebook!' ? <SortBtn show={this.showSortPanelHandler}/> : null;
    const emptyTrash = this.props.onTrash ?
    <button onClick={this.props.emptyTrash} className={classes.EmptyTrashBtn}>Empty Trash</button> : null;
    const searchIconSpan = this.props.onSearch ? <span className={classes.SearchIcon}>{searchIcon}</span> : null;
    return (
      <div className={outlineClass}>
        <div className={classes.OutlineHeader}>
          <div className={classes.JournalTitle}>
            {searchIconSpan}
            {this.props.notebookTitle}
            {emptyTrash}
          </div>
          <div className={classes.NoteTotal}>
            {this.props.notebookCount} {this.props.notebookCount === 1 ? 'note' : 'notes'}
            {settingsBtn}
            {sortBtn}
          </div>
          <SettingsOptionsPanel ref={settingsPanel => { this.settingsPanel = settingsPanel; }}
          show={this.state.showSettingsPanel} rename={this.props.renameNotebook} delete={this.props.deleteNotebook}
          setDefault={this.props.setDefaultNotebook}/>
          <SortOptionsPanel ref={sortPanel => { this.sortPanel = sortPanel; }} show={this.state.showSortPanel}
          sortStyle={this.props.sortStyle} sort={this.props.sortStyleHandler} />
        </div>
        <div className={classes.OutlineContent}>
          {notebookNotes}
        </div>
      </div>
    );
  }
}

export default Outline;
