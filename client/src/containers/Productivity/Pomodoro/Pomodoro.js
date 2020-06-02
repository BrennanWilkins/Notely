import React, { Component } from 'react';
import classes from './Pomodoro.module.css';
import TimeDisplay from '../../../components/ProductivityUI/TimeDisplay/TimeDisplay';
import TimeControlBtns from '../../../components/ProductivityUI/TimeControlBtns/TimeControlBtns';
import { connect } from 'react-redux';
import * as actions from '../store/actions/index';
import Wrapper from '../../../components/ProductivityUI/Wrapper/Wrapper';

class Pomodoro extends Component {
  state = {
    expanded: false
  }

  // toggles nav bar opened/closed
  expandDetailHandler = () => {
    this.setState(prevState => { return { expanded: !prevState.expanded }});
    this.props.expandDetail();
  }

  render() {
    return (
      <Wrapper expanded={this.state.expanded} title="Pomodoro Timer" collapse={this.props.collapse}
      expand={this.expandDetailHandler}>
        <div className={classes.Pomodoro}>
          <div className={classes.PomodoroBtns}>
            <button onClick={this.props.onChangePomodoro.bind(this, 25)}>Pomodoro</button>
            <button onClick={this.props.onChangePomodoro.bind(this, 5)}>Short Break</button>
            <button onClick={this.props.onChangePomodoro.bind(this, 15)}>Long Break</button>
          </div>
          <TimeDisplay time={this.props.displayTime} />
          <TimeControlBtns reset={this.props.onResetPomodoro} start={this.props.onStartPomodoro}
          resetText="Reset" startText={this.props.started ? 'Stop' : 'Start'} />
          <h2>Pomodoros Finished: {this.props.pomodoroCount}</h2>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  displayTime: state.pomodoro.displayTime,
  pomodoroCount: state.pomodoro.pomodoroCount,
  currentMax: state.pomodoro.currentMax,
  sec: state.pomodoro.sec,
  min: state.pomodoro.min,
  started: state.pomodoro.started
});

const mapDispatchToProps = dispatch => ({
  onChangePomodoro: (time) => dispatch(actions.changePomodoro(time)),
  onResetPomodoro: () => dispatch(actions.resetPomodoro()),
  onStartPomodoro: () => dispatch(actions.startPomodoro())
});

export default connect(mapStateToProps, mapDispatchToProps)(Pomodoro);
