import * as actionTypes from './actionTypes';

export const changePomodoro = (time) => {
  return { type: actionTypes.CHANGE_POMODORO, time };
};

export const resetPomodoro = () => {
  return { type: actionTypes.RESET_POMODORO };
};

export const stopPomodoro = () => {
  return { type: actionTypes.STOP_POMODORO };
};

export const pomodoroStart = () => {
  return { type: actionTypes.POMODORO_START };
};

export const pomodoroFinished = () => {
  return { type: actionTypes.POMODORO_FINISHED };
};

export const pomodoroCycleEnd = (displayTime, sec, min) => {
  return { type: actionTypes.POMODORO_CYCLE_END, displayTime, sec, min };
};

export const startPomodoro = () => {
  return (dispatch, getState) => {
    if (getState().pomodoro.started) { return dispatch(stopPomodoro()); }
    dispatch(pomodoroStart());
    const timerFunc = () => {
      if (!getState().pomodoro.started) { return clearInterval(timer); }
      let min = getState().pomodoro.min;
      let sec = getState().pomodoro.sec;
      // if currently in pomodoro mode of timer & timer finishes then alert
      // & add 1 to pomodoro finished count
      if (min === 0 && sec === 0 && getState().pomodoro.currentMax === 25) {
        alert('Pomodoro finished!');
        return dispatch(pomodoroFinished());
      // if currently on short/long break then reset the timer
      } else if (min === 0 && sec === 0) {
        return dispatch(resetPomodoro());
      } else if (sec === 0) {
        min--;
        sec = 59;
      } else {
        sec--;
      }
      const displaySec = sec < 10 ? '0' + sec : sec;
      const displayTime = `${min}:${displaySec}`;
      dispatch(pomodoroCycleEnd(displayTime, sec, min));
    };
    const timer = setInterval(timerFunc, 1000);
  };
};
