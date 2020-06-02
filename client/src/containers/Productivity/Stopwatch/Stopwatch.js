import React, { Component } from 'react';
import classes from './Stopwatch.module.css';
import TimeDisplay from '../../../components/ProductivityUI/TimeDisplay/TimeDisplay';
import TimeControlBtns from '../../../components/ProductivityUI/TimeControlBtns/TimeControlBtns';
import { connect } from 'react-redux';
import * as actions from '../store/actions/index';
import Wrapper from '../../../components/ProductivityUI/Wrapper/Wrapper';

class Stopwatch extends Component {
  state = {
    expanded: false
  }

  // toggles nav bar closed/opened
  expandDetailHandler = () => {
    this.setState(prevState => { return { expanded: !prevState.expanded }});
    this.props.expandDetail();
  }

  render() {
    // show laps if stopwatch started
    const lap = this.props.firstStart ? (
      <div className={classes.Lap}>
        <p>Lap {this.props.laps.length + 1}</p>
        <p>{this.props.lapDisplayTime}</p>
      </div>
    ) : null;
    return (
      <Wrapper expanded={this.state.expanded} expand={this.expandDetailHandler} title="Stopwatch"
      collapse={this.props.collapse}>
        <div className={classes.Stopwatch}>
          <TimeDisplay time={this.props.displayTime} />
          <TimeControlBtns reset={this.props.onResetStopwatch} start={this.props.onStartStopwatch}
          resetText={this.props.time.started ? 'Lap' : 'Reset'}
          startText={this.props.time.started ? 'Stop' : 'Start'}/>
          <hr />
          <div className={classes.LapList}>
            {lap}
            {this.props.laps.map((lap, i) => {
              return (
                <div key={i} className={classes.Lap}>
                  <p>Lap {this.props.laps.length - i}</p>
                  <p>{lap}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  displayTime: state.stopwatch.displayTime,
  lapDisplayTime: state.stopwatch.lapDisplayTime,
  time: state.stopwatch.time,
  lapTime: state.stopwatch.lapTime,
  laps: state.stopwatch.laps,
  firstStart: state.stopwatch.firstStart
});

const mapDispatchToProps = dispatch => ({
  onResetStopwatch: () => dispatch(actions.resetStopwatch()),
  onStartStopwatch: () => dispatch(actions.startStopwatch()),
  onStartLapTimer: () => dispatch(actions.startLapTimer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Stopwatch);
