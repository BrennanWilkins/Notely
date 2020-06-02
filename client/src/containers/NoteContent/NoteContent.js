import React from 'react';
import classes from './NoteContent.module.css';
import { expandBtn, contractBtn, notebookIcon, threeDots, trashIcon,
  checkMark, repeatIcon, errorCircle } from '../../components/UIIcons';
import '../../popupAnims.css';
import TextEditor from '../../components/TextEditor/TextEditor';
import TrashOptionPanel from '../../components/Panels/TrashOptionPanel/TrashOptionPanel';
import OptionPanel from '../../components/Panels/OptionPanel/OptionPanel';

class NoteContent extends React.Component {
  state = {
    expanded: false,
    showOptionsPanel: false
  }

  // adds/removes event listener for opening/closing option panel
  showOptionsPanel = () => {
    if (!this.state.showOptionsPanel) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState(prevState => { return { showOptionsPanel: !prevState.showOptionsPanel }});
  }

  // if option panel clicked then return else close the option panel on outside click
  handleOutsideClick = (e) => {
    if (this.optionPanel.contains(e.target)) { return; }
    this.showOptionsPanel();
  }

  // toggles nav bar opened/closed
  expandDetailHandler = () => {
    this.setState(prevState => { return { expanded: !prevState.expanded }});
    this.props.expandDetail();
  }

  // close option panel when move to clicked
  moveToHandler = () => {
    this.showOptionsPanel();
    this.props.moveTo();
  }

  // close option panel when delete note button clicked
  deleteNoteHandler = () => {
    this.showOptionsPanel();
    this.props.deleteNote();
  }

  // go to notebook when notebook button clicked
  goToNotebookHandler = () => {
    if (this.props.onTrash) { return; }
    if (this.state.expanded) {
      this.setState({ expanded: false });
      this.props.expandDetail();
    }
    this.props.goToNotebook();
  }

  // close option panel when delete permanently clicked
  deleteTrashHandler = () => {
    this.showOptionsPanel();
    this.props.deleteTrash();
  }

  // close option panel when restore note clicked
  restoreTrashHandler = () => {
    this.showOptionsPanel();
    this.props.restoreTrash();
  }

  duplicateNoteHandler = () => {
    this.showOptionsPanel();
    this.props.duplicateNote();
  }

  render() {
    const expandDetailBtn = this.state.expanded ? contractBtn : expandBtn;
    const contentClass = (
      this.props.expandShortcut ? (this.state.expanded ? classes.DetailContentExpanded : classes.ShortcutContentContracted) :
      this.props.collapse ? (this.state.expanded ? classes.DetailContentExpanded : classes.DetailContentContractedCollapse) :
      this.state.expanded ? classes.DetailContentExpanded :
      classes.DetailContentContracted
    );
    const containerClass = (
      this.props.expandShortcut ? (this.state.expanded ? classes.DetailExpanded :
        (this.props.collapse ? classes.ShortcutContractedCollapse : classes.ShortcutContracted)) :
      this.props.collapse ? (this.state.expanded ? classes.DetailExpanded : classes.DetailContractedCollapse) :
      this.state.expanded ? classes.DetailExpanded :
      classes.DetailContracted
    );
    // return noteContent without the text editors if notebook is empty or no note is selected
    if (this.props.empty || this.props.currNote === null) {
      return (
        <div className={containerClass}>
          <div className={classes.DetailHeader}>
            <div className={classes.HeaderTopBtns}>
              <div className={classes.HeaderTopLeftBtns}>
                <button className={classes.ExpandBtn} onClick={this.expandDetailHandler}>{expandDetailBtn}</button>
              </div>
            </div>
          </div>
          <div className={contentClass}></div>
          <div ref={optionPanel => { this.optionPanel = optionPanel; }}></div>
        </div>
      );
    }
    const shortcutText = this.props.currNote.favorite ? 'Remove shortcut' : 'Add to shortcuts';
    // set the option panel to have trash options if in trash mode else normal ones
    const optionsPanel = this.props.onTrash ? (
      <TrashOptionPanel show={this.state.showOptionsPanel} restore={this.restoreTrashHandler}
      delete={this.deleteTrashHandler} ref={optionPanel => { this.optionPanel = optionPanel; }}/>
      ) : (
      <OptionPanel show={this.state.showOptionsPanel} moveTo={this.moveToHandler} delete={this.deleteNoteHandler}
      duplicate={this.duplicateNoteHandler} toggleShortcut={this.props.toggleShortcut} shortcutText={shortcutText}
      ref={optionPanel => { this.optionPanel = optionPanel; }}/>
    );
    const notebookIcon1 = this.props.onTrash ? trashIcon : notebookIcon;
    let lastUpdated = this.props.currNote.date.toDateString().split(' ');
    lastUpdated = `${lastUpdated[1]} ${lastUpdated[2].charAt(0) === '0' ?
    lastUpdated[2].slice(1) : lastUpdated[2]}, ${lastUpdated[3]}`;
    // set the saved state display based on status
    const saved = (
      // note successful saved to server
      this.props.saved === 'Saved' ?
      <span className={classes.SavedSpan}>{checkMark}<span>All changes saved</span></span> :
      // note currently being saved to server
      this.props.saved === 'Saving' ?
      <span className={classes.SavedSpan}>{repeatIcon}<span>Saving...</span></span> :
      // error saving note to server
      <span className={classes.SavedSpan}>{errorCircle}<span>Changes not saved</span></span>
    );
    return (
      <div className={containerClass}>
        <div className={classes.DetailHeader}>
          <div className={classes.HeaderTopBtns}>
            <div className={classes.HeaderTopLeftBtns}>
              <button className={classes.ExpandBtn} onClick={this.expandDetailHandler}>{expandDetailBtn}</button>
              <button className={classes.NotebookBtn} onClick={this.goToNotebookHandler}>
                <span className={classes.NotebookIcon}>{notebookIcon1}</span>
                <span className={classes.NotebookBtnTitle}>{this.props.notebookTitle}</span>
              </button>
            </div>
            <button className={classes.OptionsBtn} onClick={this.showOptionsPanel}><span>{threeDots}</span></button>
          </div>
          <div className={classes.HeaderBottomBtns}>
            <span className={classes.LastUpdated}>Last edited on {lastUpdated}</span>
            <span className={classes.Saved}>{saved}</span>
          </div>
          {optionsPanel}
        </div>
        <div className={contentClass}>
          <div className={classes.InputFields}>
            <TextEditor key={String([this.props.currNote.id, this.props.onSearch, this.props.searchValue, 'title'].join(''))}
            searchValue={this.props.searchValue} readOnly={this.props.onTrash} title={true}
            textEditorChange={this.props.changeTextEditorHandler} expanded={this.state.expanded}
            editorState={this.props.currNote.title} onSearch={this.props.onSearch}/>
            <TextEditor key={String([this.props.currNote.id, this.props.onSearch, this.props.searchValue].join(''))}
            searchValue={this.props.searchValue} readOnly={this.props.onTrash} title={false}
            textEditorChange={this.props.changeTextEditorHandler} expanded={this.state.expanded}
            editorState={this.props.currNote.body} onSearch={this.props.onSearch}/>
          </div>
        </div>
      </div>
    );
  }
};

export default NoteContent;
