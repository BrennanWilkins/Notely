import * as actionTypes from './actionTypes';

export const resetStopwatch = () => {
  return { type: actionTypes.RESET_STOPWATCH };
};

export const stopStopwatch = () => {
  return { type: actionTypes.STOP_STOPWATCH };
};

export const stopwatchStart = () => {
  return { type: actionTypes.STOPWATCH_START };
};

export const startStopwatch = () => {
  return (dispatch, getState) => {
    if (getState().stopwatch.time.started) { return dispatch(stopStopwatch()); }
    dispatch(stopwatchStart());
    const timerFunc = () => {
      const time = { ...getState().stopwatch.time };
      // clear the timer if timer stopped
      if (!time.started) { return clearInterval(timer); }
      // fractionSec equal to 100ms
      time.fractionSec++;
      // fractionSec set back to zero every 1000ms
      if (time.fractionSec >= 10) {
        time.fractionSec = 0;
        time.sec++;
      }
      if (time.sec >= 60) {
        time.sec = 0;
        time.min++;
      }
      const displaySec = time.sec < 10 ? '0' + time.sec : time.sec;
      const displayMin = time.min < 10 ? '0' + time.min : time.min;
      const displayTime = `${displayMin}:${displaySec}.${time.fractionSec}`;
      dispatch(setStopwatchTime(time, displayTime));
    };
    const timer = setInterval(timerFunc, 100);
    if (!getState().stopwatch.firstStart) { dispatch(stopwatchFirstStart()); }
    // automatically start a new lap timer when stopwatch started
    dispatch(startLapTimer());
  };
};

export const setLapTime = (lapTime, lapDisplayTime) => {
  return { type: actionTypes.SET_LAP_TIME, lapTime, lapDisplayTime };
};

export const startLapTimer = () => {
  return (dispatch, getState) => {
    const timerFunc = () => {
      if (!getState().stopwatch.time.started) { return clearInterval(timer); }
      const lapTime = { ...getState().stopwatch.lapTime };
      lapTime.fractionSec++;
      if (lapTime.fractionSec >= 10) {
        lapTime.fractionSec = 0;
        lapTime.sec++;
      }
      if (lapTime.sec >= 60) {
        lapTime.sec = 0;
        lapTime.min++;
      }
      const displaySec = lapTime.sec < 10 ? '0' + lapTime.sec : lapTime.sec;
      const displayMin = lapTime.min < 10 ? '0' + lapTime.min : lapTime.min;
      const lapDisplayTime = `${displayMin}:${displaySec}.${lapTime.fractionSec}`;
      dispatch(setLapTime(lapTime, lapDisplayTime));
    };
    const timer = setInterval(timerFunc, 100);
  };
};

export const setStopwatchTime = (time, displayTime) => {
  return { type: actionTypes.SET_STOPWATCH_TIME, time, displayTime };
};

export const stopwatchFirstStart = () => {
  return { type: actionTypes.STOPWATCH_FIRST_START };
};
