import * as actionTypes from '../actions/actionTypes';

const initialState = {
  displayTime: '',
  hours: 0,
  maxHours: 0,
  min: 0,
  maxMin: 0,
  sec: 0,
  maxSec: 0,
  started: false,
  firstStart: false
};

// initializes time display when timer starts
const setFirstStart = (state, action) => {
  const displaySec = state.maxSec < 10 ? '0' + state.maxSec : state.maxSec;
  const displayMin = state.maxMin < 10 ? '0' + state.maxMin : state.maxMin;
  const displayTime = state.maxHours === 0 ? `${state.min}:${displaySec}` : `${state.hours}:${displayMin}:${displaySec}`;
  return { ...state, firstStart: true, displayTime };
};

// resets timer time display & sets all time counts back to original values
const resetTimer = (state, action) => {
  const displaySec = state.maxSec < 10 ? '0' + state.maxSec : state.maxSec;
  const displayMin = state.maxMin < 10 ? '0' + state.maxMin : state.maxMin;
  const displayTime = state.maxHours === 0 ? `${state.maxMin}:${displaySec}` : `${state.maxHours}:${displayMin}:${displaySec}`;
  return { ...state, started: false, firstStart: false, hours: state.maxHours, min: state.maxMin, sec: state.maxSec, displayTime };
};

// called after every 1000ms cycle of timerFunc
const timerCycleEnd = (state, action) => {
  const displaySec = action.sec < 10 ? '0' + action.sec : action.sec;
  const displayMin = action.min < 10 ? '0' + action.min : action.min;
  const displayTime = action.hours === 0 ? `${action.min}:${displaySec}` : `${action.hours}:${displayMin}:${displaySec}`;
  return { ...state, hours: action.hours, min: action.min, sec: action.sec, displayTime };
};

// update the input values
const changeTimer = (state, action) => {
  // cant have negative time
  if (action.e.value < 0) { return { ...state }; }
  const field = action.e.name === 'maxHours' ? 'hours' : action.e.name === 'maxMin' ? 'min' : 'sec';
  const value = Number(action.e.value);
  return { ...state, [action.e.name]: value, [field]: value };
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SET_FIRST_START: return setFirstStart(state, action);
    case actionTypes.PAUSE_TIMER: return { ...state, started: false };
    case actionTypes.TIMER_START: return { ...state, started: true };
    case actionTypes.RESET_TIMER: return resetTimer(state, action);
    case actionTypes.TIMER_CYCLE_END: return timerCycleEnd(state, action);
    case actionTypes.CHANGE_TIMER: return changeTimer(state, action);
    default: return state;
  }
};

export default reducer;
