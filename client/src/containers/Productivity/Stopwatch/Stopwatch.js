import React, { Component } from 'react';
import classes from './Stopwatch.module.css';
import TimeDisplay from '../../../components/ProductivityUI/TimeDisplay/TimeDisplay';
import TimeControlBtns from '../../../components/ProductivityUI/TimeControlBtns/TimeControlBtns';
import ProductivityHeader from '../../../components/ProductivityUI/ProductivityHeader/ProductivityHeader';
import { connect } from 'react-redux';
import * as actions from '../store/actions/index';

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
    const contentClass = this.state.expanded ? classes.ContentExpanded : classes.ContentContracted;
    const headerClass = this.state.expanded ? classes.Expanded : this.props.collapse ? classes.Collapsed : classes.Contracted;
    // show laps if stopwatch started
    const lap = this.props.firstStart ? (
      <div className={classes.Lap}>
        <p>Lap {this.props.laps.length + 1}</p>
        <p>{this.props.lapDisplayTime}</p>
      </div>
    ) : null;
    return (
      <div className={headerClass}>
        <ProductivityHeader expanded={this.state.expanded} expand={this.expandDetailHandler} title="Stopwatch" />
        <div className={contentClass}>
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
        </div>
      </div>
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
