import React, { Component } from 'react';
import NoteContent from './NoteContent/NoteContent';
import OutlineContent from './OutlineContent/OutlineContent';
import NavBar from './NavBar/NavBar';
import MoveNotePanel from '../components/Panels/MoveNotePanel/MoveNotePanel';
import DeleteNotePanel from '../components/Panels/DeleteNotePanel/DeleteNotePanel';
import AddNotebookPanel from '../components/Panels/AddNotebookPanel/AddNotebookPanel';
import RenameNotebookPanel from '../components/Panels/RenameNotebookPanel/RenameNotebookPanel';
import DeleteNotebookPanel from '../components/Panels/DeleteNotebookPanel/DeleteNotebookPanel';
import Backdrop from '../components/Backdrop/Backdrop';
import { ContentState, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { instance as axios } from '../axios';
import ErrorPanel from '../components/Panels/ErrorPanel/ErrorPanel';
import NavBarPopup from '../components/Popups/NavBarPopup/NavBarPopup';
import NavBarPanel from '../components/Panels/NavBarPanel/NavBarPanel';
import Timer from './Productivity/Timer/Timer';
import Stopwatch from './Productivity/Stopwatch/Stopwatch';
import Pomodoro from './Productivity/Pomodoro/Pomodoro';

class Notely extends Component {
  state = {
    notes: [],
    notebooks: [],
    shortcuts: [],
    detailExpanded: false,
    currentNote: null,
    currentNotebook: null,
    currentNotebookNotes: [],
    shortcutExpand: false,
    emptyNotebook: false,
    showMoveTo: false,
    selectedNotebookId: null,
    showDeletePanel: false,
    showAddNotebook: false,
    changeNotebookText: '',
    showArrow: false,
    showRenameNotebook: false,
    showDeleteNotebook: false,
    defaultNotebook: null,
    showTrash: false,
    trash: [],
    sortStyle: 'Updated Most',
    showSearch: false,
    searchValue: '',
    confirmedSearchValue: '',
    error: false,
    errorMsg: '',
    saved: 'Saved',
    savedCount: 0,
    popupText: '',
    showNavPopup: false,
    showNavBar: true,
    showNotebookPanel: false,
    showShortcutPanel: false,
    showTimer: false,
    showPomodoro: false,
    showStopwatch: false
  }

  componentDidMount() {
    if (window.innerWidth < 750) {
      this.setState({ showNavBar: false });
    }
    if (this.props.demo) {
      // if in demo mode, preload example data
      const titleState = EditorState.createWithContent(ContentState.createFromText('Example Note'));
      const editorTitleState = JSON.stringify(convertToRaw(titleState.getCurrentContent()));
      const bodyText = 'Use the navigation panel to navigate to your shortcuts or notebooks, create a new notebook ' +
      'or note, access the productivity tools like the pomodoro timer, and search through your notes.\n' +
      'Use the toolbar to change the font, create lists, and more.\n' +
      'Use the button at the top right for note options, like adding a note to shortcuts.\n' +
      'Use the buttons below the notebook title for notebook options and sorting.';
      // convert plain text to draft.js format
      const bodyState = EditorState.createWithContent(ContentState.createFromText(bodyText));
      const editorBodyState = JSON.stringify(convertToRaw(bodyState.getCurrentContent()));
      const exampleNote = { title: editorTitleState, body: editorBodyState, favorite: true, trash: false,
        dateCreated: new Date(), date: new Date(), id: '1', notebookId: '1' };
      const exampleNotebook = { title: 'Example Notebook', id: '1', default: false };
      const shortcut = { title: editorTitleState, id: '1' };
      return this.setState({ notes: [exampleNote], notebooks: [exampleNotebook], shortcuts: [shortcut],
        currentNotebookNotes: [exampleNote], currentNotebook: exampleNotebook, currentNote: exampleNote });
    }

    // if not in demo mode, retrieve notebooks/notes from server
    axios.get('notebooks/' + this.props.userId).then(res => {
      if (res.status === 200) {
        // map retrieved notebooks to notebook objects
        const notebooks = res.data.notebooks.map(notebook => {
          const notebookData = { title: notebook.title, default: notebook.default, id: notebook._id };
          if (notebook.default) { this.setState({ defaultNotebook: notebookData }); }
          return notebookData;
        });
        this.setState({ notebooks });
      // not successful
      } else {
        return this.errorHandler('There was an error retrieving your notebooks.');
      }
    }).catch(err => {
      return this.errorHandler('There was an error retrieving your notebooks.');
    });

    axios.get('notes/' + this.props.userId).then(res => {
      if (res.status === 200) {
        // map retrieved notes to note objects
        const resNotes = res.data.notes.map(note => {
          return { title: note.title, body: note.body, favorite: note.favorite,
            notebookId: note.notebookId, trash: note.trash, dateCreated: new Date(note.dateCreated),
            date: new Date(note.date), id: note._id };
        });
        // sort data before setting state
        const notes = resNotes.filter(note => !note.trash).sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
        const shortcuts = resNotes.filter(note => note.favorite).sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        }).map(shortcut => ({ title: shortcut.title, id: shortcut.id }));
        const trash = resNotes.filter(note => note.trash).sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
        this.setState({ notes, shortcuts, trash });
      // if not successful
      } else {
        return this.errorHandler('There was an error retrieving your notes.');
      }
    }).catch(err => {
      return this.errorHandler('There was an error retrieving your notes.');
    });
  }

  // called if error sending request to server
  errorHandler = (errorMsg) => {
    this.setState({ error: true, errorMsg });
  }

  // called when expand button is pressed to expand/contract note content
  expandDetail = () => {
    this.setState(prevState => { return { detailExpanded: !prevState.detailExpanded }});
  }

  // called when shortcut link is clicked in nav bar
  goToShortcutHandler = (id) => {
    // set current note to note matching id
    const currentNote = this.state.notes.filter(note => note.id === id)[0];

    // resets all UI state and sets note content to be in shortcut expand layout
    this.resetSearchUI();
    this.resetTimeUI();
    this.resetSort();
    this.resetNavPanels();
    this.setState({ currentNote, shortcutExpand: true, currentNotebook: null,
      emptyNotebook: false, showTrash: false });
  }

  // called when note is clicked in outline content
  changeNoteHandler = (id) => {
    // if showing trash get currentNote from trash state
    if (this.state.showTrash) {
      const currentNote = this.state.trash.filter(note => note.id === id)[0];
      this.setState({ currentNote });
    // if not showing trash get currentNote from all notes
    } else {
      const currentNote = this.state.notes.filter(note => note.id === id)[0];
      this.setState({ currentNote });
    }
  }

  // called when notebook clicked in nav bar
  goToNotebookHandler = (id) => {
    // set currentNotebookNotes to notes w matching notebook id
    const currentNotebookNotes = this.state.notes.filter(note => note.notebookId === id);
    // sort notes by most recently updated
    currentNotebookNotes.sort((a, b) => { return b.date.getTime() - a.date.getTime(); });
    const currentNotebook = this.state.notebooks.filter(notebook => notebook.id === id)[0];
    // currentNote is null if currentNotebook is empty
    const currentNote = currentNotebookNotes.length > 0 ? { ...currentNotebookNotes[0] } : null;
    // make note content empty if currentNotebook is empty
    const emptyNotebook = currentNotebookNotes.length > 0 ? false : true;

    this.resetSearchUI();
    this.resetTimeUI();
    this.resetSort();
    this.resetNavPanels();
    this.setState({ currentNotebook, currentNote, currentNotebookNotes, emptyNotebook,
      showTrash: false, shortcutExpand: false });
  }

  // resets search UI
  resetSearchUI = () => {
    this.setState({ showSearch: false, searchValue: '', confirmedSearchValue: '' });
  }

  // resets all productivity UI
  resetTimeUI = () => {
    this.setState({ showTimer: false, showPomodoro: false, showStopwatch: false });
  }

  // resets sortStyle to updated most recently
  resetSort = () => {
    this.setState({ sortStyle: 'Updated Most' });
  }

  // resets the nav bar panels to closed if open
  resetNavPanels = () => {
    this.setState({ showNotebookPanel: false, showShortcutPanel: false });
  }

  // called when all notes clicked in nav bar
  showAllHandler = () => {
    // show empty note content/outline content if no notes
    if (this.state.notes.length === 0) {
      this.setState({ currentNotebook: null, currentNote: null, emptyNotebook: true });
    // get all notes & sort by most recently updated
    } else {
      const notes = this.state.notes.sort((a, b) => { return b.date.getTime() - a.date.getTime(); });
      this.setState({ currentNotebook: null, currentNote: notes[0], emptyNotebook: false });
    }

    this.resetSearchUI();
    this.resetTimeUI();
    this.resetSort();
    this.resetNavPanels();
    this.setState({ showTrash: false, shortcutExpand: false });
  }

  // called when new note button pressed in nav bar
  createNewNoteHandler = () => {
    // if no notebooks return
    if (this.state.notebooks.length === 0) { return; }
    // create new title & body in draft js format
    const editorBodyState = JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()));
    const titleState = EditorState.createWithContent(ContentState.createFromText('Note'));
    const editorTitleState = JSON.stringify(convertToRaw(titleState.getCurrentContent()));
    const currentNote = { title: editorTitleState, body: editorBodyState, favorite: false,
      trash: false, dateCreated: new Date(), date: new Date(), id: '', notebookId: '' };
    // set new note id to notebook id of either the default notebook, currentNotebook,
    // or first notebook in state
    currentNote.notebookId = this.state.currentNotebook === null ?
    (this.state.defaultNotebook === null ? this.state.notebooks[0].id :
    this.state.defaultNotebook.id) : this.state.currentNotebook.id;
    if (this.props.demo) {
      const notes = [...this.state.notes];
      // if in demo mode create a unique note id using Math.random
      currentNote.id = Math.floor(Math.random() * 100000);
      while(true) {
        const noteCount = notes.filter(note => note.id === currentNote.id);
        if (noteCount.length === 0) { break; }
        else { currentNote.id = Math.floor(Math.random() * 100000); }
      }

      notes.unshift(currentNote);
      if (this.state.showTrash || this.state.showSearch) {
        this.setState({ currentNotebook: null });
      } else {
        const currentNotebookNotes = [...this.state.currentNotebookNotes];
        currentNotebookNotes.unshift(currentNote);
        this.setState({ currentNotebookNotes });
      }

      this.resetSearchUI();
      this.resetNavPanels();
      this.resetTimeUI();
      return this.setState({ currentNote, notes, emptyNotebook: false,
        shortcutExpand: false, showTrash: false });
    }

    // if not in demo send new note request to server
    axios.post('notes', { ...currentNote, userId: this.props.userId }).then(res => {
        if (res.status === 200) {
          // set new note's id to server generated id
          currentNote.id = res.data.noteId;
          const notes = [...this.state.notes];
          notes.unshift(currentNote);
          if (this.state.showTrash || this.state.showSearch) {
            this.setState({ currentNotebook: null });
          } else {
            const currentNotebookNotes = [...this.state.currentNotebookNotes];
            currentNotebookNotes.unshift(currentNote);
            this.setState({ currentNotebookNotes });
          }

          this.resetSearchUI();
          this.resetNavPanels();
          this.resetTimeUI();
          return this.setState({ currentNote, notes, emptyNotebook: false,
            shortcutExpand: false, showTrash: false });
        }
        // if not sucessful
        return this.errorHandler('There was an error creating a new note.');
    }).catch(err => {
      return this.errorHandler('There was an error creating a new note.');
    });
  }

  // called when note added/removed from shortcuts
  toggleShortcutHandler = () => {
    const currentNote = this.state.currentNote === null ?
    { ...this.state.notes[0] } : { ...this.state.currentNote };
    currentNote.favorite = !currentNote.favorite;
    let shortcuts = [...this.state.shortcuts];
    // if note isnt in shortcuts then push it, else remove it
    if (currentNote.favorite) {
      shortcuts.push({ title: currentNote.title, id: currentNote.id });
    } else {
      shortcuts = shortcuts.filter(shortcut => shortcut.id !== currentNote.id);
    }
    const notes = [...this.state.notes];
    // update the note state
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === currentNote.id) { notes[i] = currentNote; }
    }
    // if in shortcut expand layout & removing the shortcut, reset the layout
    if (this.state.shortcutExpand && !currentNote.favorite) {
      this.setState({ shortcutExpand: false });
    }
    // update the currentNotebookNotes state
    const currentNotebookNotes = [...this.state.currentNotebookNotes];
    for (let note of currentNotebookNotes) {
      if (note.id === currentNote.id) { note.favorite = currentNote.favorite; }
    }
    if (this.props.demo) {
      return this.setState({ currentNote, notes, shortcuts, currentNotebookNotes, showTrash: false });
    }

    // if not in demo send request to server
    axios.put('notes/' + currentNote.id, { ...currentNote, userId: this.props.userId }).then(res => {
      if (res.status === 200) {
        return this.setState({ currentNote, notes, shortcuts, currentNotebookNotes, showTrash: false });
      }
      // not successful
      return this.errorHandler('There was an error creating the shortcut.');
    }).catch(err => {
      return this.errorHandler('There was an error creating the shortcut.');
    });
  }

  // called when move note panel is opened/closed
  toggleMoveToHandler = () => {
    this.setState(prevState => { return { showMoveTo: !prevState.showMoveTo }});
    // set selectedNotebookId back to null once panel is opened/closed
    this.setState({ selectedNotebookId: null });
  }

  // called when a notebook is clicked in move note panel
  moveNoteHandler = (id) => {
    this.setState({ selectedNotebookId: id });
  }

  // called when move is clicked in move note panel
  moveNoteHandlerConfirm = () => {
    if (this.state.selectedNotebookId === null) {
      return this.setState({ showMoveTo: false });
    }
    // update the current note to have the new notebook id
    const currNote = this.state.currentNote === null ?
    { ...this.state.notes[0] } : { ...this.state.currentNote };
    // if notebook is the same as before then close panel
    if (currNote.notebookId === this.state.selectedNotebookId) {
      return this.setState({ showMoveTo: false });
    }
    // set current note notebook id to selected notebook's id
    currNote.notebookId = this.state.selectedNotebookId;
    // update note state
    const notes = [...this.state.notes];
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === currNote.id) { notes[i] = currNote; }
    }
    // update and go to the new notebook
    const currentNotebook = this.state.notebooks.filter(notebook => notebook.id === currNote.notebookId)[0];
    const currentNotebookNotes = notes.filter(note => note.notebookId === currentNotebook.id);
    if (this.props.demo) {
      this.resetSearchUI();
      this.resetSort();
      return this.setState({ currentNote: currNote, notes, currentNotebook,
        currentNotebookNotes, selectedNotebookId: null, showMoveTo: false });
    }
    // if not in demo mode then send request to server
    axios.put('notes/' + currNote.id, { ...currNote, userId: this.props.userId, trash: false }).then(res => {
      if (res.status === 200) {
        this.resetSort();
        this.resetSearchUI();
        return this.setState({ currentNote: currNote, notes, currentNotebook,
          currentNotebookNotes, selectedNotebookId: null, showMoveTo: false });
      }
      // if not successful
      this.setState({ showMoveTo: false });
      return this.errorHandler('There was an error moving the note.');
    }).catch(err => {
      this.setState({ showMoveTo: false });
      return this.errorHandler('There was an error moving the note.');
    });
  }

  // shows the delete note confirm panel
  deleteNoteHandler = () => {
    this.setState({ showDeletePanel: true });
  }

  // called if delete button clicked in delete note panel
  confirmDeleteNote = () => {
    const oldNote = this.state.currentNote === null ? this.state.notes[0] : this.state.currentNote;
    const notes = this.state.notes.filter(note => note.id !== oldNote.id);
    const shortcuts = this.state.shortcuts.filter(note => note.id !== oldNote.id);
    const currentNotebookNotes = this.state.currentNotebookNotes.filter(note => note.id !== oldNote.id);
    const emptyNotebook = this.state.currentNotebookNotes.length === 0 ?
    (notes.length === 0 ? true : false) : false;
    const currentNote = this.state.currentNotebook === null ?
    (this.state.notes.length === 0 ? null : notes[0]) :
    (currentNotebookNotes.length === 0 ? null : currentNotebookNotes[0]);
    const trash = [...this.state.trash];
    trash.unshift(oldNote);
    if (this.props.demo) {
      return this.setState({ trash, showDeletePanel: false, notes, shortcuts,
        currentNotebookNotes, emptyNotebook, currentNote, shortcutExpand: false });
    }
    // if not in demo mode then send server request
    axios.put('notes/' + oldNote.id, { ...oldNote, trash: true, userId: this.props.userId }).then(res => {
      if (res.status === 200) {
        return this.setState({ trash, showDeletePanel: false, notes, shortcuts,
          currentNotebookNotes, emptyNotebook, currentNote, shortcutExpand: false });
      }
      // not successful
      this.closeDeletePanel();
      return this.errorHandler('There was an error deleting the note.');
    }).catch(err => {
      this.closeDeletePanel();
      return this.errorHandler('There was an error deleting the note.');
    });
  }

  // closes the delete note panel
  closeDeletePanel = () => {
    this.setState({ showDeletePanel: false });
  }

  // called when duplicate note button clicked
  duplicateNoteHandler = () => {
    const currNote = this.state.currentNote === null ?
    { ...this.state.notes[0] } : { ...this.state.currentNote };
    // create new note w duplicated title/body in draft js format
    let noteTitle = (EditorState.createWithContent(convertFromRaw(JSON.parse(currNote.title)))).getCurrentContent().getPlainText();
    noteTitle += '(Copy)';
    let newTitle = convertToRaw(EditorState.createWithContent(ContentState.createFromText(noteTitle)).getCurrentContent());
    newTitle = JSON.stringify(newTitle);
    currNote.title = newTitle;
    currNote.favorite = false;
    currNote.trash = false;
    currNote.date = new Date();
    currNote.dateCreated = new Date();
    if (this.props.demo) {
      const notes = [...this.state.notes];
      // if in demo mode create new id using Math.random
      currNote.id = Math.floor(Math.random() * 100000);
      while(true) {
        const noteCount = notes.filter(note => note.id === currNote.id);
        if (noteCount.length === 0) { break; }
        else { currNote.id = Math.floor(Math.random() * 100000); }
      }
      notes.unshift(currNote);
      const currentNotebookNotes = [...this.state.currentNotebookNotes];
      currentNotebookNotes.unshift(currNote);
      // if not in search mode then update the current notebook
      if (!this.state.showSearch) {
        const currentNotebook = this.state.notebooks.filter(notebook => notebook.id === currNote.notebookId)[0];
        if (this.state.shortcutExpand) {
          this.setState({ currentNotebook });
        }
      }
      return this.setState({ notes, currentNote: currNote, currentNotebookNotes, shortcutExpand: false });
    }
    // if not in demo mode send server request
    axios.post('notes', { ...currNote, userId: this.props.userId }).then(res => {
      if (res.status === 200) {
        // set new note's id to server generated id
        currNote.id = res.data.noteId;
        const notes = [...this.state.notes];
        notes.unshift(currNote);
        const currentNotebookNotes = [...this.state.currentNotebookNotes];
        currentNotebookNotes.unshift(currNote);
        // if not in search mode then update the current notebook
        if (!this.state.showSearch) {
          const currentNotebook = this.state.notebooks.filter(notebook => notebook.id === currNote.notebookId)[0];
          if (this.state.shortcutExpand) {
            this.setState({ currentNotebook });
          }
        }
        return this.setState({ notes, currentNote: currNote, currentNotebookNotes, shortcutExpand: false });
      }
      // not successful
      return this.errorHandler('There was an error duplicating the note.');
    }).catch(err => {
      return this.errorHandler('There was an error duplicating the note.');
    });
  }

  // called when new notebook button clicked to show/remove the panel
  toggleNotebookHandler = () => {
    this.setState(prevState => {
      return { showAddNotebook: !prevState.showAddNotebook, changeNotebookText: '' };
    });
  }

  // set the add notebook panel input value
  changeNotebookTextHandler = (e) => {
    this.setState({ changeNotebookText: e.target.value });
  }

  // called when create clicked in add notebook panel
  confirmNotebookHandler = () => {
    // new title set to input value
    const notebookTitle = this.state.changeNotebookText;
    if (this.props.demo) {
      // if in demo mode create id using Math.random
      let demoId = Math.floor(Math.random() * 100000);
      while(true) {
        const notebookCount = this.state.notebooks.filter(notebook => notebook.id === demoId);
        if (notebookCount.length === 0) { break; }
        else { demoId = Math.floor(Math.random() * 100000); }
      }
      const newNotebook = { title: notebookTitle, id: demoId, default: false };
      const notebooks = [...this.state.notebooks];
      notebooks.unshift(newNotebook);

      this.resetSort();
      this.resetTimeUI();
      this.resetSearchUI();
      this.resetNavPanels();
      return this.setState({ notebooks, currentNotebook: newNotebook, emptyNotebook: true,
        showArrow: false, currentNotebookNotes: [], currentNote: null, showAddNotebook: false,
        changeNotebookText: '', shortcutExpand: false, showTrash: false });
    }
    // if not in demo mode then send server request
    axios.post('notebooks', { title: notebookTitle, userId: this.props.userId }).then(res => {
      if (res.status === 200) {
        // set notebook id to server generated id
        const newNotebook = { title: notebookTitle, id: res.data.notebookId, default: false };
        const notebooks = [...this.state.notebooks];
        notebooks.unshift(newNotebook);

        this.resetSort();
        this.resetTimeUI();
        this.resetSearchUI();
        this.resetNavPanels();
        return this.setState({ notebooks, currentNotebook: newNotebook, emptyNotebook: true,
          showArrow: false, currentNotebookNotes: [], currentNote: null, showAddNotebook: false,
          changeNotebookText: '', shortcutExpand: false, showTrash: false });
      }
      // not successful
      this.toggleNotebookHandler();
      return this.errorHandler('There was an error creating the notebook.');
    }).catch(err => {
      this.toggleNotebookHandler();
      return this.errorHandler('There was an error creating the notebook.');
    });
  }

  // called when rename notebook button clicked
  renameNotebookHandler = () => {
    if (this.state.showSearch) { return; }
    // if panel not already open then set input value to notebook's title
    if (!this.state.showRenameNotebook) {
      const changeNotebookText = this.state.currentNotebook.title;
      return this.setState({ changeNotebookText, showRenameNotebook: true });
    }
    // else close the panel
    this.closeRenameNotebook();
  }

  // closes the rename notebook panel & resets input value
  closeRenameNotebook = () => {
    this.setState({ showRenameNotebook: false, changeNotebookText: '' });
  }

  // called when rename button clicked in rename notebook panel
  confirmRenameNotebookHandler = () => {
    const currNotebook = { ...this.state.currentNotebook };
    // set title to input value
    currNotebook.title = this.state.changeNotebookText;
    const notebooks = [...this.state.notebooks];
    // update notebook state
    for (let notebook of notebooks) {
      if (notebook.id === currNotebook.id) { notebook.title = this.state.changeNotebookText; }
    }
    if (this.props.demo) {
      return this.setState({ changeNotebookText: '', currentNotebook: currNotebook,
        notebooks, showRenameNotebook: false });
    }
    // if not in demo mode send server request
    axios.put('notebooks/' + currNotebook.id, { title: currNotebook.title, default: currNotebook.default,
    userId: this.props.userId }).then(res => {
      if (res.status === 200) {
        return this.setState({ changeNotebookText: '', currentNotebook: currNotebook,
          notebooks, showRenameNotebook: false });
      }
      // not successful
      this.closeRenameNotebook();
      return this.errorHandler('There was an error renaming the notebook.');
    }).catch(err => {
      this.closeRenameNotebook();
      return this.errorHandler('There was an error renaming the notebook.');
    });
  }

  // called when delete notebook button clicked, opens/closes panel
  deleteNotebookHandler = () => {
    if (this.state.showSearch) { return; }
    this.setState(prevState => { return { showDeleteNotebook: !prevState.showDeleteNotebook }});
  }

  // called when delete button clicked in delete notebook panel
  confirmDeleteNotebookHandler = () => {
    const notebooks = this.state.notebooks.filter(notebook => notebook.id !== this.state.currentNotebook.id);
    const shortcutNote = this.state.notes.filter(note => note.notebookId === this.state.currentNotebook.id)[0];
    const shortcuts = this.state.shortcuts.filter(shortcut => shortcut.id !== shortcutNote.id);
    const notes = this.state.notes.filter(note => note.notebookId !== this.state.currentNotebook.id);
    const trash = [...this.state.trash];
    // adds all notes in the notebook to trash
    for (let note of this.state.currentNotebookNotes) { trash.unshift(note); }
    // if notebook was default notebook then set defaultNotebook to null
    const defaultNotebook = this.state.defaultNotebook === null ? null : (
      this.state.currentNotebook.id === this.state.defaultNotebook.id ? null : this.state.defaultNotebook);
    if (this.props.demo) {
      this.resetSort();
      return this.setState({ trash, currentNote: null, defaultNotebook, currentNotebook: null,
        notebooks, shortcuts, notes, showDeleteNotebook: false });
    }
    // if not in demo mode send server request
    axios.delete('notebooks/' + this.state.currentNotebook.id).then(res => {
      if (res.status === 200) {
        this.resetSort();
        return this.setState({ trash, currentNote: null, defaultNotebook, currentNotebook: null,
          notebooks, shortcuts, notes, showDeleteNotebook: false });
      }
      // not successful
      this.deleteNotebookHandler();
      return this.errorHandler('There was an error deleting the notebook.');
    }).catch(err => {
      this.deleteNotebookHandler();
      return this.errorHandler('There was an error deleting the notebook.');
    });
  }

  // called when set as default notebook button clicked
  setDefaultNotebookHandler = () => {
    if (this.state.showSearch) { return; }
    const currentNotebook = { ...this.state.currentNotebook };
    currentNotebook.default = true;
    if (this.props.demo) {
      return this.setState({ defaultNotebook: currentNotebook });
    }
    // if not in demo mode send server request
    // server sets default value to true for currentNotebook & false for all others
    axios.put('notebooks/setDefault/' + currentNotebook.id, { ...currentNotebook, userId: this.props.userId })
    .then(res => {
      if (res.status === 200) {
        return this.setState({ defaultNotebook: currentNotebook });
      }
      // not successful
      return this.errorHandler('There was an error setting the default notebook.');
    }).catch(err => {
      return this.errorHandler('There was an error setting the default notebook.');
    });
  }

  // called when trash button clicked in nav bar
  showTrashHandler = () => {
    // if no notebooks return
    if (this.state.notebooks.length === 0) { return; }
    const trash = [...this.state.trash];
    // set currentNote to first note in trash
    const currentNote = trash.length === 0 ? null : trash[0];

    this.resetSort();
    this.resetSearchUI();
    this.resetTimeUI();
    this.resetNavPanels();
    this.setState({ showTrash: true, currentNote, shortcutExpand: false });
  }

  // called when empty trash button clicked in trash mode
  emptyTrashHandler = () => {
    if (this.props.demo) {
      return this.setState({ trash: [] });
    }
    // if not in demo send server request
    // deletes all notes in trash state
    for (let note of this.state.trash) {
      axios.delete('notes/' + note.id).then(res => {
        if (res.data.msg !== 'Success.') {
          return this.errorHandler('There was an error while emptying the trash.');
        }
      }).catch(err => {
        return this.errorHandler('There was an error while emptying the trash.');
      });
    }
    this.setState({ trash: [] });
  }

  // called when restore note button clicked in trash mode
  restoreTrashHandler = () => {
    const currentNote = { ...this.state.currentNote };
    const notebooks = this.state.notebooks.filter(notebook => notebook.id === currentNote.notebookId);
    // sets currentNote id to either default notebook or first notebook
    if (notebooks.length === 0) {
      currentNote.notebookId = this.state.defaultNotebook === null ?
      this.state.notebooks[0].id : this.state.defaultNotebook.id;
    }
    // add note back to note state
    const notes = [...this.state.notes];
    notes.unshift(currentNote);
    // remove note from trash
    const trash = this.state.trash.filter(note => note.id !== currentNote.id);
    const shortcuts = [...this.state.shortcuts];
    if (currentNote.favorite) { shortcuts.unshift({ title: currentNote.title, id: currentNote.id }); }
    // set new current note to first note in trash
    const newCurrentNote = trash.length === 0 ? null : trash[0];
    if (this.props.demo) {
      return this.setState({ notes, trash, shortcuts, currentNote: newCurrentNote });
    }
    // if not in demo mode send server request
    axios.put('notes/' + currentNote.id, { ...currentNote, trash: false, userId: this.props.userId })
    .then(res => {
      if (res.status === 200) {
        return this.setState({ notes, trash, shortcuts, currentNote: newCurrentNote });
      }
      // not successful
      return this.errorHandler('There was an error restoring the note.');
    }).catch(err => {
      return this.errorHandler('There was an error restoring the note.');
    });
  }

  // called when delete note button pressed in trash mode
  deleteTrashHandler = () => {
    // remove note from trash
    const trash = this.state.trash.filter(note => note.id !== this.state.currentNote.id);
    const currentNote = trash.length === 0 ? null : trash[0];
    if (this.props.demo) {
      return this.setState({ trash, currentNote });
    }
    // if not in demo mode send server request
    axios.delete('notes/' + this.state.currentNote.id).then(res => {
      if (res.status === 200) {
        return this.setState({ trash, currentNote });
      }
      // not successful
      return this.errorHandler('There was an error deleting the note.');
    }).catch(err => {
      return this.errorHandler('There was an error deleting the note.');
    });
  }

  // sets new sort style from sort style panel
  sortStyleHandler = (option) => {
    this.setState({ sortStyle: option });
  }

  // updates search bar input value
  setSearchValueHandler = (e) => {
    if (this.state.notebooks.length === 0) { return; }
    this.setState({ searchValue: e.target.value });
  }

  // clears the input value in search bar
  clearSearchHandler = () => {
    this.setState({ searchValue: '' });
  }

  // if enter pressed then show the search results
  goToSearchHandler = () => {
    // if no search value entered or no notebooks then return
    if (this.state.searchValue === '' || this.state.notebooks.length === 0) { return; }
    // create search results by converting all notes title/body from draft js
    // to plain text & returning true if the note contains the search value
    const searchResults = this.state.notes.filter(note => {
      const noteTitle = (
        (EditorState.createWithContent(convertFromRaw(JSON.parse(note.title)))).getCurrentContent().getPlainText().toLowerCase());
      const noteBody = (
        (EditorState.createWithContent(convertFromRaw(JSON.parse(note.body)))).getCurrentContent().getPlainText().toLowerCase());
      return (noteTitle.includes(this.state.searchValue.toLowerCase()) ||
      noteBody.includes(this.state.searchValue.toLowerCase()));
    });
    // sort search results by most recently updated
    searchResults.sort((a, b) => { return b.date.getTime() - a.date.getTime(); });
    const currentNote = searchResults.length === 0 ? null : searchResults[0];

    this.resetTimeUI();
    this.setState({ confirmedSearchValue: this.state.searchValue, showTrash: false,
      shortcutExpand: false, showSearch: true, currentNotebookNotes: searchResults, currentNote });
  }

  changeTextEditorHandler = (editorState, field) => {
    const currentNote = this.state.currentNote === null ?
    this.state.notes[0] : this.state.currentNote;
    // if currently editing note body
    if (field === 'body') {
      // convert body to storable form from draft js form
      const newBody = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      // if no change then return
      if (newBody === currentNote.body) { return; }
      currentNote.date = new Date();
      currentNote.body = newBody;
    // if currently editing note title
    } else if (field === 'title') {
      // convert title to storable form from draft js form
      const newTitle = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      // if no change then return
      if (newTitle === currentNote.title) { return; }
      currentNote.date = new Date();
      currentNote.title = newTitle;
    }
    // find note in note state & update note state
    const notes = [...this.state.notes];
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === currentNote.id) { notes[i] = currentNote; break; }
    }
    this.setState({ currentNote, notes });
    // if note is favorited then update shortcut state
    if (currentNote.favorite) {
      const shortcuts = [...this.state.shortcuts];
      for (let i = 0; i < shortcuts.length; i++) {
        if (shortcuts[i].id === currentNote.id && shortcuts[i].title !== currentNote.title) {
          shortcuts[i].title = currentNote.title;
          this.setState({ shortcuts });
          break;
        }
      }
    }
    // if currently editing in a notebook then update currentNotebookNotes
    if (this.state.currentNotebookNotes !== null) {
      const currentNotebookNotes = [...this.state.currentNotebookNotes];
      for (let i = 0; i < currentNotebookNotes.length; i++) {
        if (currentNotebookNotes[i].id === currentNote.id) { currentNotebookNotes[i] = currentNote; break; }
      }
      this.setState({ currentNotebookNotes });
    }
    // savedCount reset to 0 for new setTimeout cycle
    this.setState({ savedCount: 0 });
    if (this.props.demo) { return; }
    // if not in demo mode then send server request
    this.updateNoteHandler();
  }

  // sends server request to update note when editing
  updateNoteHandler = () => {
    const currNote = this.state.currentNote === null ? this.state.notes[0] : this.state.currentNote;
    const timerFunc = () => {
      // oldNote used to compare to currentNote bc of closure
      const oldNote = this.state.currentNote === null ? this.state.notes[0] : this.state.currentNote;
      // if oldNote not equal to currentNote or savedCount more than 0 then clear timer
      if (oldNote.body !== currNote.body || oldNote.title !== currNote.title || this.state.savedCount >= 1) {
        return clearTimeout(timer);
      }
      // set all changes saved to saving & increase savedCount by 1
      this.setState({ saved: 'Saving', savedCount: this.state.savedCount + 1 });
      // send server request to update note if user hasnt typed in 2000ms
      axios.put('notes/' + currNote.id, { ...currNote, userId: this.props.userId }).then(res => {
        if (res.status === 200) {
          return this.setState({ saved: 'Saved' });
        }
        // not successful
        return this.setState({ saved: 'Not Saved' });
      }).catch(err => {
        return this.setState({ saved: 'Not Saved' });
      });
    };
    // timer executes after 2000ms & only if user hasnt edited note in this time
    const timer = setTimeout(timerFunc, 2000);
  }

  // clears error panel if is open
  closeErrorPanel = () => {
    this.setState({ error: false, errorMsg: '' });
  }

  // sets the text of the navbar popup when nav bar is collapsed
  setNavPopupText = (popupText) => {
    this.setState({ popupText, showNavPopup: true });
  }

  // clears the nav bar popup when not hovering over button in nav bar
  hideNavPopup = () => {
    this.setState({ showNavPopup: false });
  }

  // called when expand nav bar button clicked, expands/collapses the nav bar
  navCollapseHandler = () => {
    this.setState(prevState => {
      if (prevState.showNavBar) {
        return { showNavBar: !prevState.showNavBar, popupText: 'Expand Sidebar' };
      }
      return { showNavBar: !prevState.showNavBar, popupText: 'Collapse Sidebar' };
    });
  }

  // called when hovering over notebook button when nav bar collapsed
  showNotebookPanelHandler = () => {
    this.setState({ showNotebookPanel: true });
  }

  // called when nav bar is collapsed & not hovering over notebook button/panel
  hideNotebookPanelHandler = (e) => {
    // if hovering out of window then dont close
    if (e.relatedTarget === window) { return; }
    // if hovering over notebook panel dont close
    if (this.notebookPanel.contains(e.relatedTarget)) { return; }
    // else close the panel
    this.setState({ showNotebookPanel: false });
  }

  // called when hovering over shortcut button when nav bar collapsed
  showShortcutPanelHandler = () => {
    this.setState({ showShortcutPanel: true });
  }

  // called when leaving either the notebook/shortcut panel & closes the panels
  navBarPanelLeaveHandler = () => {
    this.setState({ showNotebookPanel: false, showShortcutPanel: false });
  }

  // called when nav bar is collapsed & not hovering over notebook button/panel
  hideShortcutPanelHandler = (e) => {
    // if hovering out of window then dont close
    if (e.relatedTarget === window) { return; }
    // if hovering over shortcut panel dont close
    if (this.shortcutPanel.contains(e.relatedTarget)) { return; }
    // else close panel
    this.setState({ showShortcutPanel: false });
  }

  // called when stopwatch clicked in nav bar, shows stopwatch UI
  goToStopwatch = () => {
    this.resetSort();
    this.resetSearchUI();
    this.resetNavPanels();
    this.setState({ currentNote: null, shortcutExpand: true, currentNotebook: null,
      emptyNotebook: false, showTrash: false, showStopwatch: true, showTimer: false,
      showPomodoro: false });
  }

  // called when timer clicked in nav bar, shows timer UI
  goToTimer = () => {
    this.resetSort();
    this.resetSearchUI();
    this.resetNavPanels();
    this.setState({ currentNote: null, shortcutExpand: true, currentNotebook: null,
      emptyNotebook: false, showTrash: false, showStopwatch: false, showTimer: true,
      showPomodoro: false });
  }

  // called when pomodoro timer clicked in nav bar, shows timer UI
  goToPomodoro = () => {
    this.resetSort();
    this.resetSearchUI();
    this.resetNavPanels();
    this.setState({ currentNote: null, shortcutExpand: true, currentNotebook: null,
      emptyNotebook: false, showTrash: false, showStopwatch: false, showTimer: false,
      showPomodoro: true });
  }

  render() {
    const notebookTitle = (
      this.state.notebooks.length === 0 ? 'Add a notebook!' :
      this.state.showTrash ? 'Trash' :
      this.state.showSearch ? this.state.confirmedSearchValue :
      this.state.currentNotebook === null ? 'All Notes' :
      this.state.notebooks.filter(notebook => notebook.id === this.state.currentNotebook.id)[0].title
    );

    const notebookCount = (
      this.state.notebooks.length === 0 ? 0 :
      this.state.showTrash ? this.state.trash.length :
      this.state.showSearch ? this.state.currentNotebookNotes.length :
      this.state.currentNotebook === null ? this.state.notes.length :
      this.state.currentNotebookNotes.length
    );

    const notebookNotes = (
      this.state.notebooks.length === 0 ? [] :
      this.state.showTrash ? this.state.trash :
      this.state.showSearch ? this.state.currentNotebookNotes :
      this.state.notes.length === 0 ? [] :
      this.state.currentNotebook === null ? this.state.notes :
      this.state.currentNotebookNotes
    );

    const currentNotebookId = (
      this.state.notebooks.length === 0 ? null :
      this.state.notes.length === 0 ? null :
      this.state.currentNote === null ? this.state.notes[0].notebookId :
      this.state.currentNote.notebookId
    );

    const currentNotebookTitle = (
      this.state.notebooks.length === 0 ? null :
      this.state.showTrash ? 'Trash' :
      this.state.notes.length === 0 ? null :
      this.state.currentNote === null ?
      this.state.notebooks.filter(notebook => notebook.id === this.state.notes[0].notebookId)[0].title :
      this.state.notebooks.filter(notebook => notebook.id === this.state.currentNote.notebookId)[0].title
    );

    const currentNote = (
      this.state.notebooks.length === 0 ? null :
      this.state.showTrash ? (this.state.trash.length === 0 ? null : this.state.currentNote) :
      this.state.notes.length === 0 ? null :
      this.state.currentNote === null ? (this.state.showSearch ? null : this.state.notes[0]) :
      this.state.currentNote
    );

    const currentNoteTitle = (
      this.state.notebooks.length === 0 ? null :
      this.state.notes.length === 0 ? null :
      this.state.currentNote === null ?
      (EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.notes[0].title)))).getCurrentContent().getPlainText() :
      (EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.currentNote.title)))).getCurrentContent().getPlainText()
    );

    const currentNoteId = (
      this.state.notebooks.length === 0 ? null :
      this.state.showTrash ? (this.state.trash.length === 0 ? null : this.state.currentNote.id) :
      this.state.notes.length === 0 ? null :
      this.state.currentNote === null ? this.state.notes[0].id :
      this.state.currentNote.id
    );

    const currentNoteNotebookId = (
      this.state.notebooks.length === 0 ? null :
      this.state.notes.length === 0 ? null :
      this.state.currentNote === null ? this.state.notes[0].notebookId :
      this.state.currentNote.notebookId
    );

    const empty = (
      this.state.showTrash ? (this.state.trash.length === 0 ? true : false) :
      this.state.emptyNotebook
    );

    const outlineContent = (
      this.state.shortcutExpand ? null :
      <OutlineContent expanded={this.state.detailExpanded} notebookTitle={notebookTitle}
      selectedId={currentNoteId} notebookNotes={notebookNotes} notebookCount={notebookCount}
      changeNote={this.changeNoteHandler} onTrash={this.state.showTrash} sortBy={this.sortByHandler}
      renameNotebook={this.renameNotebookHandler} deleteNotebook={this.deleteNotebookHandler}
      setDefaultNotebook={this.setDefaultNotebookHandler} emptyTrash={this.emptyTrashHandler}
      sortStyleHandler={this.sortStyleHandler} sortStyle={this.state.sortStyle}
      onSearch={this.state.showSearch} searchValue={this.state.confirmedSearchValue}
      collapse={!this.state.showNavBar}/>
    );

    const backdrop = (this.state.showMoveTo || this.state.showDeletePanel || this.state.showAddNotebook
    || this.state.showRenameNotebook || this.state.showDeleteNotebook || this.state.error) ?
    <Backdrop /> : null;

    const showArrow = (this.state.notebooks.length === 0 || this.state.showArrow) && !this.state.showAddNotebook;

    const noteContent = (
      this.state.showTimer ?
      <Timer expandDetail={this.expandDetail} collapse={!this.state.showNavBar} /> :
      this.state.showStopwatch ?
      <Stopwatch expandDetail={this.expandDetail} collapse={!this.state.showNavBar} /> :
      this.state.showPomodoro ?
      <Pomodoro expandDetail={this.expandDetail} collapse={!this.state.showNavBar} /> :
      <NoteContent expandShortcut={this.state.shortcutExpand} currNote={currentNote}
      empty={empty} onSearch={this.state.showSearch} onTrash={this.state.showTrash}
      goToNotebook={this.goToNotebookHandler.bind(this, currentNoteNotebookId)}
      toggleShortcut={this.toggleShortcutHandler} moveTo={this.toggleMoveToHandler}
      deleteNote={this.deleteNoteHandler} duplicateNote={this.duplicateNoteHandler}
      deleteTrash={this.deleteTrashHandler} restoreTrash={this.restoreTrashHandler}
      expandDetail={this.expandDetail} notebookTitle={currentNotebookTitle}
      searchValue={this.state.confirmedSearchValue} changeTextEditorHandler={this.changeTextEditorHandler}
      saved={this.state.saved} collapse={!this.state.showNavBar} />
    );
    return (
      <div>
        <NavBarPanel show={this.state.showNotebookPanel} goToNotebook={this.goToNotebookHandler}
        links={this.state.notebooks} ref={notebookPanel => this.notebookPanel = notebookPanel}
        panelLeave={this.navBarPanelLeaveHandler} isNotebook />
        <NavBarPanel show={this.state.showShortcutPanel} goToShortcut={this.goToShortcutHandler}
        links={this.state.shortcuts} ref={shortcutPanel => this.shortcutPanel = shortcutPanel}
        panelLeave={this.navBarPanelLeaveHandler} isNotebook={false} />
        <NavBar expanded={this.state.detailExpanded} shortcuts={this.state.shortcuts} showArrow={showArrow}
        logout={this.props.logout} notebooks={this.state.notebooks} goToShortcut={this.goToShortcutHandler}
        showTrash={this.showTrashHandler} goToNotebook={this.goToNotebookHandler} showAllNotes={this.showAllHandler}
        onTrash={this.state.showTrash} newNote={this.createNewNoteHandler} addNotebook={this.toggleNotebookHandler}
        searchValue={this.state.searchValue} setSearchValue={this.setSearchValueHandler} hidePopup={this.hideNavPopup}
        clearSearch={this.clearSearchHandler} goToSearch={this.goToSearchHandler} showPopup={this.setNavPopupText}
        collapseHandler={this.navCollapseHandler} collapse={!this.state.showNavBar} showNotebooks={this.showNotebookPanelHandler}
        showShortcuts={this.showShortcutPanelHandler} hideNotebooks={this.hideNotebookPanelHandler}
        hideShortcuts={this.hideShortcutPanelHandler} demo={this.props.demo} goToTimer={this.goToTimer}
        goToStopwatch={this.goToStopwatch} goToPomodoro={this.goToPomodoro} />
        {noteContent}
        {outlineContent}
        {backdrop}
        <MoveNotePanel show={this.state.showMoveTo} close={this.toggleMoveToHandler}
        confirm={this.moveNoteHandlerConfirm} id={this.state.selectedNotebookId} notebooks={this.state.notebooks}
        move={this.moveNoteHandler} currentId={currentNotebookId} />
        <DeleteNotePanel show={this.state.showDeletePanel} close={this.closeDeletePanel}
        confirm={this.confirmDeleteNote} title={currentNoteTitle} />
        <AddNotebookPanel show={this.state.showAddNotebook} close={this.toggleNotebookHandler}
        confirm={this.confirmNotebookHandler} notebookText={this.state.changeNotebookText}
        changeText={this.changeNotebookTextHandler} />
        <RenameNotebookPanel show={this.state.showRenameNotebook} close={this.renameNotebookHandler}
        text={this.state.changeNotebookText} confirm={this.confirmRenameNotebookHandler}
        changeText={this.changeNotebookTextHandler} />
        <DeleteNotebookPanel show={this.state.showDeleteNotebook} delete={this.deleteNotebookHandler}
        title={notebookTitle} confirmDelete={this.confirmDeleteNotebookHandler} />
        <ErrorPanel show={this.state.error} close={this.closeErrorPanel} errorMsg={this.state.errorMsg} />
        <NavBarPopup popupText={this.state.popupText} showPopup={this.state.showNavPopup} collapse={!this.state.showNavBar}/>
      </div>
    );
  }
};

export default Notely;
