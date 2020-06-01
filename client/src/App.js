import React, { Component, Suspense } from 'react';
import ErrorBoundary from './components/ErrorDisplay/ErrorDisplay';
import Auth from './containers/Auth/Auth';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Spinner from './components/Spinner/Spinner';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import pomodoroReducer from './containers/Productivity/store/reducers/pomodoro';
import timerReducer from './containers/Productivity/store/reducers/timer';
import stopwatchReducer from './containers/Productivity/store/reducers/stopwatch';
const Notely = React.lazy(() => import('./containers/Notely'));

const rootReducer = combineReducers({
  stopwatch: stopwatchReducer,
  pomodoro: pomodoroReducer,
  timer: timerReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

class App extends Component {
  state = {
    isAuth: false
  }

  handleWindowClose = () => {
    // if remember me not chosen, log user out when window closes
    const remember = localStorage['remember'];
    if (remember === 'false') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('remember');
      localStorage.removeItem('email');
    }
  }

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('remember');
    localStorage.removeItem('email');
    this.setState({ isAuth: false });
  }

  componentDidMount() {
    // event listener for closing the window
    window.addEventListener('beforeunload', this.handleWindowClose);
    const token = localStorage['token'];
    const userId = localStorage['userId'];
    // if ls contains both token & userId, user is authenticated
    if (token && userId) {
      this.setState({ isAuth: true });
    }
  }

  componentWillUnmount() {
    // remove window close event listener on unmount
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

  isAuthHandler = () => {
    this.setState({ isAuth: true });
  }

  render() {
    // if user is authenticated, load Notely, else provide the other routes
    // any unknown routes redirects to "/" route
    const routes = this.state.isAuth ? (
      <Switch>
        <Route exact path="/" render={() =>
          <Suspense fallback={<Spinner />}>
            <Notely userId={localStorage['userId']} logout={this.logout} demo={false}/>
          </Suspense>
        } />
        <Redirect to="/" />
      </Switch>
    ) : (
      <Switch>
        <Route exact path="/login" render={() => <Auth login={true} isAuth={this.isAuthHandler}/>} />
        <Route exact path="/signup" render={() => <Auth login={false} isAuth={this.isAuthHandler}/>} />
        <Route exact path="/demo" render={() => <Suspense fallback={<Spinner />}><Notely demo /></Suspense>} />
        <Redirect to="/login" />
      </Switch>
    );
    // store is provided to persist the productivity state
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary>
            {routes}
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    );
  }
};

export default App;
