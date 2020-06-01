import * as actionTypes from './actionTypes';

export const changeTimer = (e) => {
  return { type: actionTypes.CHANGE_TIMER, e };
};

export const resetTimer = () => {
  return { type: actionTypes.RESET_TIMER };
};

export const setFirstStart = () => {
  return { type: actionTypes.SET_FIRST_START };
};

export const pauseTimer = () => {
  return { type: actionTypes.PAUSE_TIMER };
};

export const timerStart = () => {
  return { type: actionTypes.TIMER_START };
};

export const timerCycleEnd = (hours, min, sec) => {
  return { type: actionTypes.TIMER_CYCLE_END, hours, min, sec };
};

export const startTimer = () => {
  return (dispatch, getState) => {
    const state = getState().timer;
    if (state.min === 0 && state.sec === 0 && state.hours === 0) { return; }
    if (state.hours < 0 || state.min < 0 || state.sec < 0) { return; }
    if (state.min >= 60 || state.sec >= 60) { return; }
    if (!state.firstStart) { dispatch(setFirstStart()); }
    // pause & return if timer already started
    if (state.started) { return dispatch(pauseTimer()); }
    dispatch(timerStart());
    const timerFunc = () => {
      const timerState = getState().timer;
      // clear the timer if timer stopped
      if (!timerState.started) { return clearInterval(timer); }
      let hours = timerState.hours;
      let min = timerState.min;
      let sec = timerState.sec;
      // create alert if timer is finished
      if (min === 0 && sec === 0 && hours === 0) {
        alert('Timer finished!');
        dispatch(resetTimer());
      } else if (hours > 0 && min === 0 && sec === 0) {
        hours--;
        min = 59;
        sec = 59;
      } else if (min > 0 && sec === 0) {
        min--;
        sec = 59;
      } else {
        sec--;
      }
      dispatch(timerCycleEnd(hours, min, sec));
    };
    const timer = setInterval(timerFunc, 1000);
  };
};
