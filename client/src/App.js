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
import { instance } from './axios';
const Notely = React.lazy(() => import('./containers/Notely'));

const rootReducer = combineReducers({
  stopwatch: stopwatchReducer,
  pomodoro: pomodoroReducer,
  timer: timerReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

let expirationTimeout;

class App extends Component {
  state = {
    isAuth: false
  }

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('remember');
    localStorage.removeItem('email');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('expirationTime');
    delete instance.defaults.headers.common['x-auth-token'];
    this.setState({ isAuth: false });
  }

  componentDidMount() {
    const token = localStorage['token'];
    // if ls contains token, try autologin
    if (!localStorage['token'] || !localStorage['expirationDate']) { return; }
    if (new Date(localStorage['expirationDate']) <= new Date()) { return this.logout(); }
    instance.defaults.headers.common['x-auth-token'] = localStorage['token'];
    const newTime = new Date(localStorage['expirationDate']).getTime() - new Date().getTime();
    localStorage['expirationTime'] = newTime;
    this.isAuthHandler();
  }

  isAuthHandler = () => {
    this.setState({ isAuth: true });
    expirationTimeout = setTimeout(() => this.logout(), Number(localStorage['expirationTime']));
  }

  render() {
    // if user is authenticated, load Notely, else provide the other routes
    // any unknown routes redirects to "/" route
    const routes = this.state.isAuth ? (
      <Switch>
        <Route exact path="/" render={() =>
          <Suspense fallback={<Spinner />}>
            <Notely logout={this.logout} demo={false}/>
          </Suspense>
        } />
        <Redirect to="/" />
      </Switch>
    ) : (
      <Switch>
        <Route exact path="/login" render={() => <Auth login isAuth={this.isAuthHandler} />} />
        <Route exact path="/signup" render={() => <Auth login={false} isAuth={this.isAuthHandler} />} />
        <Route exact path="/demo" render={() => <Suspense fallback={<Spinner />}><Notely demo /></Suspense>} />
        <Redirect to="/login" />
      </Switch>
    );
    // store used to persist productivity state
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
