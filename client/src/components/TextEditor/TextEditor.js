import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { RichUtils, EditorState, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './TextEditor.module.css';

// finds the search terms in the text
const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText().toLowerCase();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

const SearchHighlight = (props) => (
  <span style={{backgroundColor: 'rgb(104, 136, 252, 0.4)'}}>{props.children}</span>
);

class TextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty()
  }

  onChange = (editorState) => {
    this.setState({ editorState });
    if (this.props.title) {
      this.props.textEditorChange(editorState, 'title');
    } else {
      this.props.textEditorChange(editorState, 'body');
    }
  }

  componentWillMount() {
    // set cursor to be at end of text on mount
    const editorState = EditorState.moveSelectionToEnd(EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.editorState))));
    this.setState({ editorState });
  }

  // if user presses enter then create soft new line, else if user presses
  // enter + shift then create new paragraph
  handleReturn = (e) => {
    if (!e.shiftKey) {
      this.setState({ editorState: RichUtils.insertSoftNewline(this.state.editorState) });
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const searchDecorator = this.props.onSearch ? [{
      strategy: (contentBlock, callback) => {
        if (this.props.searchValue !== '') {
          findWithRegex(new RegExp(this.props.searchValue.toLowerCase(), 'g'), contentBlock, callback);
        }
      },
      component: SearchHighlight
    }] : [];
    if (this.props.title) {
      return (
        <Editor handleReturn={this.handleReturn} editorClassName={classes.TitleEditor} toolbarHidden
        onEditorStateChange={this.onChange} placeholder="Title" readOnly={this.props.readOnly}
        editorState={this.state.editorState} customDecorators={searchDecorator} />
      );
    } else {
      const toolbarClass = this.props.shortcut ? classes.ToolbarShortcutted : this.props.expanded ? classes.ToolbarExpanded :
      this.props.collapsed ? classes.ToolbarCollapsed : classes.Toolbar;
      return (
        <Editor toolbarClassName={toolbarClass} editorClassName={classes.BodyEditor} handleReturn={this.handleReturn}
        onEditorStateChange={this.onChange} placeholder="Start Here..." editorState={this.state.editorState}
        readOnly={this.props.readOnly} customDecorators={searchDecorator} toolbarOnFocus
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji'],
          list: { options: ['unordered', 'ordered'] },
          textAlign: { inDropdown: true },
          inline: { inDropdown: true },
          colorPicker: { popupClassName: classes.ColorPopup },
          emoji: { popupClassName: classes.EmojiPopup }
        }}/>
      );
    }
  }
}

export default TextEditor;
