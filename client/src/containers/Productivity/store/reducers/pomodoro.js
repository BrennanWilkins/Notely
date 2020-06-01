import * as actionTypes from '../actions/actionTypes';

const initialState = {
  displayTime: '25:00',
  pomodoroCount: 0,
  currentMax: 25,
  sec: 0,
  min: 25,
  started: false
};

// set the current mode of the timer (pomodoro/short break/long break)
const changePomodoro = (state, action) => {
  const displayTime = `${action.time}:00`;
  return { ...state, min: action.time, sec: 0, started: false, currentMax: action.time, displayTime };
};

const resetPomodoro = (state, action) => {
  const displayTime = `${state.currentMax}:00`;
  return { ...state, started: false, min: state.currentMax, sec: 0, displayTime };
};

const pomodoroFinished = (state, action) => {
  const displayTime = `${state.currentMax}:00`;
  let pomodoroCount = state.pomodoroCount + 1;
  return { ...state, started: false, min: state.currentMax, sec: 0, displayTime, pomodoroCount };
};

// called after every 1000ms cycle of timerFunc
const pomodoroCycleEnd = (state, action) => {
  return { ...state, displayTime: action.displayTime, sec: action.sec, min: action.min };
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_POMODORO: return changePomodoro(state, action);
    case actionTypes.RESET_POMODORO: return resetPomodoro(state, action);
    case actionTypes.STOP_POMODORO: return { ...state, started: false };
    case actionTypes.POMODORO_START: return { ...state, started: true };
    case actionTypes.POMODORO_FINISHED: return pomodoroFinished(state, action);
    case actionTypes.POMODORO_CYCLE_END: return pomodoroCycleEnd(state, action);
    default: return state;
  }
};

export default reducer;
