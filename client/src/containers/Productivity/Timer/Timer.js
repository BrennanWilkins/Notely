import React, { Component } from 'react';
import classes from './Timer.module.css';
import TimeDisplay from '../../../components/ProductivityUI/TimeDisplay/TimeDisplay';
import TimeControlBtns from '../../../components/ProductivityUI/TimeControlBtns/TimeControlBtns';
import { connect } from 'react-redux';
import * as actions from '../store/actions/index';
import Wrapper from '../../../components/ProductivityUI/Wrapper/Wrapper';

class Timer extends Component {
  state = {
    expanded: false
  }

  // toggles nav bar opened/closed
  expandDetailHandler = () => {
    this.setState(prevState => { return { expanded: !prevState.expanded }});
    this.props.expandDetail();
  }

  render() {
    // shows input fields to set timer if timer not started, if started shows TimeDisplay
    const inputFields = this.props.firstStart ? null : (
      <div className={classes.TimerDropdown}>
        <div>Hrs
          <input type="number" value={String(this.props.maxHours)} name="maxHours" onChange={e => this.props.onChangeTimer(e.target)}/>
        </div>
        <div>Min
          <input type="number" value={String(this.props.maxMin)} name="maxMin" onChange={e => this.props.onChangeTimer(e.target)}/>
        </div>
        <div>Sec
          <input type="number" value={String(this.props.maxSec)} name="maxSec" onChange={e => this.props.onChangeTimer(e.target)}/>
        </div>
      </div>
    );
    return (
      <Wrapper expanded={this.state.expanded} expand={this.expandDetailHandler} title="Timer"
      collapse={this.props.collapse}>
        <div className={classes.Timer}>
          {inputFields}
          {this.props.firstStart ? <TimeDisplay time={this.props.displayTime} /> : null}
          <TimeControlBtns reset={this.props.onResetTimer} start={this.props.onStartTimer} resetText="Cancel"
          startText={this.props.started ? 'Stop' : 'Start'} />
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  displayTime: state.timer.displayTime,
  hours: state.timer.hours,
  maxHours: state.timer.maxHours,
  min: state.timer.min,
  maxMin: state.timer.maxMin,
  sec: state.timer.sec,
  maxSec: state.timer.maxSec,
  started: state.timer.started,
  firstStart: state.timer.firstStart
});

const mapDispatchToProps = dispatch => ({
  onChangeTimer: (e) => dispatch(actions.changeTimer(e)),
  onResetTimer: () => dispatch(actions.resetTimer()),
  onStartTimer: () => dispatch(actions.startTimer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
