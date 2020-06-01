import * as actionTypes from '../actions/actionTypes';

const initialState = {
  displayTime: '00:00.0',
  lapDisplayTime: '00:00.0',
  time: {
    fractionSec: 0,
    sec: 0,
    min: 0,
    started: false
  },
  lapTime: {
    fractionSec: 0,
    sec: 0,
    min: 0,
    started: false
  },
  laps: [],
  firstStart: false
};

const resetStopwatch = (state, action) => {
  // resets time & laps if left control button in reset mode
  if (!state.time.started) {
    const time = { ...state.time };
    time.fractionSec = 0;
    time.sec = 0;
    time.min = 0;
    time.started = false;
    const lapTime = { ...state.lapTime };
    lapTime.fractionSec = 0;
    lapTime.sec = 0;
    lapTime.min = 0;
    lapTime.started = false;
    return { ...state, time, lapTime, displayTime: '00:00.0', laps: [], firstStart: false };
  }
  // creates a new lap if left control button in lap mode
  const lapTime = { ...state.lapTime };
  const displaySec = lapTime.sec < 10 ? '0' + lapTime.sec : lapTime.sec;
  const displayMin = lapTime.min < 10 ? '0' + lapTime.min : lapTime.min;
  const lapDisplayTime = `${displayMin}:${displaySec}.${lapTime.fractionSec}`;
  lapTime.fractionSec = 0;
  lapTime.sec = 0;
  lapTime.min = 0;
  lapTime.started = false;
  const laps = [...state.laps];
  laps.unshift(state.lapDisplayTime);
  return { ...state, lapTime, lapDisplayTime, laps };
};

const stopStopwatch = (state, action) => {
  const time = { ...state.time };
  time.started = false;
  return { ...state, time };
};

const stopwatchStart = (state, action) => {
  const time = { ...state.time };
  time.started = true;
  const lapTime = { ...state.lapTime };
  lapTime.started = true;
  return { ...state, time, lapTime };
};

const setStopwatchTime = (state, action) => {
  return { ...state, time: action.time, displayTime: action.displayTime };
};

const stopwatchFirstStart = (state, action) => {
  return { ...state, firstStart: true };
};

const setLapTime = (state, action) => {
  return { ...state, lapTime: action.lapTime, lapDisplayTime: action.lapDisplayTime };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_STOPWATCH: return resetStopwatch(state, action);
    case actionTypes.STOP_STOPWATCH: return stopStopwatch(state, action);
    case actionTypes.STOPWATCH_START: return stopwatchStart(state, action);
    case actionTypes.SET_STOPWATCH_TIME: return setStopwatchTime(state, action);
    case actionTypes.STOPWATCH_FIRST_START: return stopwatchFirstStart(state, action);
    case actionTypes.SET_LAP_TIME: return setLapTime(state, action);
    default: return state;
  }
};

export default reducer;
