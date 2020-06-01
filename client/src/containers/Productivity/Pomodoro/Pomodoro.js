import React, { Component } from 'react';
import classes from './Pomodoro.module.css';
import TimeDisplay from '../../../components/ProductivityUI/TimeDisplay/TimeDisplay';
import TimeControlBtns from '../../../components/ProductivityUI/TimeControlBtns/TimeControlBtns';
import ProductivityHeader from '../../../components/ProductivityUI/ProductivityHeader/ProductivityHeader';
import { connect } from 'react-redux';
import * as actions from '../store/actions/index';

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
    const contentClass = this.state.expanded ? classes.ContentExpanded : classes.ContentContracted;
    const headerClass = this.state.expanded ? classes.Expanded : this.props.collapse ? classes.Collapsed : classes.Contracted;
    return (
      <div className={headerClass}>
        <ProductivityHeader expanded={this.state.expanded} expand={this.expandDetailHandler} title="Pomodoro Timer" />
        <div className={contentClass}>
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
        </div>
      </div>
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
