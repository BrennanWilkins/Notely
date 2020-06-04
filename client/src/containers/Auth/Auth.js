import React, { Component } from 'react';
import classes from './Auth.module.css';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { authInstance as axios, instance } from '../../axios';

class Auth extends Component {
  state = {
    loginInfo: { email: '', password: '' },
    signupInfo: { email: '', password: '', confirmPassword: '' },
    error: false,
    errorMsg: '',
    loading: false,
    remember: false
  }

  // returns true if input fields are invalid else returns false
  checkValidity = () => {
    // check if email input is a valid email
    const emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.props.login) {
      if (this.state.loginInfo.email.length === 0 || this.state.loginInfo.password.length === 0) {
        this.setState({ error: true, errorMsg: 'Email and password must not be empty.' });
        return true;
      } else if (!emailTest.test(this.state.loginInfo.email) || this.state.loginInfo.email.length > 70 ||
        this.state.loginInfo.password.length > 70) {
        this.setState({ error: true, errorMsg: 'There is no account for the email you entered.' });
        return true;
      }
    } else {
      if (!emailTest.test(this.state.signupInfo.email)) {
        this.setState({ error: true, errorMsg: 'Please enter a valid email address.' });
        return true;
      } else if (this.state.signupInfo.email.length === 0 || this.state.signupInfo.password.length === 0) {
        this.setState({ error: true, errorMsg: 'Email and password must not be empty.' });
        return true;
      } else if (this.state.signupInfo.password.length > 70) {
        this.setState({ error: true, errorMsg: 'Password must be less than 70 characters.'});
        return true;
      } else if (this.state.signupInfo.password.length < 7) {
        this.setState({ error: true, errorMsg: 'Password must be at least 7 characters long.'});
        return true;
      } else if (this.state.signupInfo.password !== this.state.signupInfo.confirmPassword) {
        this.setState({ error: true, errorMsg: 'Confirm password must be equal to password.'});
        return true;
      }
    }
    return false;
  }

  // show the spinner if loading
  toggleLoading = () => {
    this.setState(prevState => { return { loading: !prevState.loading, error: false, errorMsg: '' }; });
  }

  authFailed = (errorMsg) => {
    this.setState({ loading: false, error: true, errorMsg });
  }

  loginHandler = (e) => {
    e.preventDefault();
    if (this.state.loading) { return; }
    // if not valid then return
    if (this.checkValidity()) { return; }
    this.toggleLoading();
    const userData = { email: this.state.loginInfo.email, password: this.state.loginInfo.password };
    // send login request to server
    axios.post('login', userData).then(res => {
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        instance.defaults.headers.common['x-auth-token'] = res.data.token;
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('remember', this.state.remember);
        localStorage.setItem('email', this.state.loginInfo.email);
        return this.props.isAuth();
      }
      // not successful
      this.authFailed(res.data.message);
    }).catch(err => {
      this.authFailed('There was an error logging in.');
    });
  }

  signupHandler = (e) => {
    e.preventDefault();
    if (this.state.loading) { return; }
    // return if signup form is invalid
    if (this.checkValidity()) { return; }
    this.toggleLoading();
    const userData = { email: this.state.signupInfo.email, password: this.state.signupInfo.password,
    confirmPassword: this.state.signupInfo.confirmPassword };
    // send signup request to server
    axios.post('signup', userData).then(res => {
      if (res.status === 200) {
        const newUserData = { email: this.state.signupInfo.email, password: this.state.signupInfo.password };
        // if signup was successful then try to automatically log user in
        axios.post('login', newUserData).then(resp => {
          if (resp.status === 200) {
            localStorage.setItem('token', resp.data.token);
            instance.defaults.headers.common['x-auth-token'] = resp.data.token;
            localStorage.setItem('userId', resp.data.userId);
            localStorage.setItem('remember', this.state.remember);
            localStorage.setItem('email', this.state.signupInfo.email);
            return this.props.isAuth();
          }
          // login not successful
          return this.authFailed('There was an error signing up.');
        }).catch(error => {
          this.authFailed('There was an error signing up.');
        });
      }
      // signup not successful
      this.authFailed('There was an error signing up.');
    }).catch(err => {
      this.authFailed('There was an error signing up.');
    });
  }

  changeLoginInfo = (e) => {
    if (this.state.loading) { return; }
    const loginInfo = { ...this.state.loginInfo };
    loginInfo[e.target.name] = e.target.value;
    this.setState({ loginInfo, error: false, errorMsg: '' });
  }

  changeSignupInfo = (e) => {
    if (this.state.loading) { return; }
    const signupInfo = { ...this.state.signupInfo };
    signupInfo[e.target.name] = e.target.value;
    this.setState({ signupInfo, error: false, errorMsg: '' });
  }

  clearFields = () => {
    this.setState({
      loginInfo: { email: '', password: '' },
      signupInfo: { email: '', password: '', confirmPassword: '' },
      loading: false,
      error: false,
      errorMsg: '',
      remember: false
    });
  }

  // called when remember me button clicked
  toggleRemember = () => {
    this.setState(prevState => { return { remember: !prevState.remember }; });
  }

  render() {
    const rememberDiv = (
      <div className={this.state.error ? [classes.Remember, classes.Move].join(' ') : classes.Remember}>
        <input type="checkbox" onChange={this.toggleRemember} checked={this.state.remember}/>
        <p>Remember me</p>
      </div>
    );
    const form = this.props.login ? (
      <React.Fragment>
        <form className={classes.Form} onSubmit={this.loginHandler}>
          <input type="text" placeholder="Email" name="email" value={this.state.loginInfo.email}
          onChange={this.changeLoginInfo}/>
          <input type="password" placeholder="Password" name="password" value={this.state.loginInfo.password}
          onChange={this.changeLoginInfo}/>
          <p className={this.state.error ? [classes.LoginError, classes.MoveError].join(' ') : classes.LoginError}>
            {this.state.errorMsg}
          </p>
          <button className={this.state.error ? classes.Move: undefined}>{this.props.login ? 'login' : 'create'}</button>
        </form>
        {rememberDiv}
      </React.Fragment>
    ) : (
      <React.Fragment>
        <form className={classes.Form} onSubmit={this.signupHandler}>
          <input type="text" placeholder="Email" name="email" value={this.state.signupInfo.email}
          onChange={this.changeSignupInfo}/>
          <input type="password" placeholder="Password" name="password" value={this.state.signupInfo.password}
          onChange={this.changeSignupInfo}/>
          <input type="password" placeholder="Confirm Password" name="confirmPassword" value={this.state.signupInfo.confirmPassword}
          onChange={this.changeSignupInfo}/>
          <p className={this.state.error ? [classes.SignupError, classes.MoveError].join(' ') : classes.SignupError}>
            {this.state.errorMsg}
          </p>
          <button className={this.state.error ? classes.Move: undefined}>{this.props.login ? 'login' : 'create'}</button>
        </form>
        {rememberDiv}
      </React.Fragment>
    );
    const message = this.props.login ? (
      <p className={classes.MessageSignup}>Not registered? <Link to="/signup" onClick={this.clearFields}>Create an account</Link></p>
    ) : (
      <p className={classes.MessageLogin}>Already registered? <Link to="/login" onClick={this.clearFields}>Login</Link></p>
    );
    return (
      <div className={classes.Container}>
        <div className={classes.FormContainer}>
          <p className={classes.Demo}>See a demo <Link to="/demo" onClick={this.clearFields}>here</Link></p>
          <h1 className={classes.Header}>Notely</h1>
          {form}
          {this.state.loading && <Spinner />}
          {message}
        </div>
      </div>
    );
  }
}

export default Auth;
