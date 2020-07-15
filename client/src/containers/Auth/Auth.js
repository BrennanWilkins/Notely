import React, { Component } from 'react';
import classes from './Auth.module.css';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { authInstance as axios, instance } from '../../axios';
import { validate } from '../../utils/authValidation';

class Auth extends Component {
  state = {
    email: '',
    pass: '',
    confirmPass: '',
    err: false,
    errMsg: '',
    loading: false,
    remember: false
  }

  toggleLoading = () => this.setState(prev => ({ loading: !prev.loading, err: false, errMsg: '' }))

  authFailed = (errMsg) => this.setState({ loading: false, err: true, errMsg })

  emailHandler = e => this.setState({ email: e.target.value, err: false })

  passHandler = e => this.setState({ pass: e.target.value, err: false })

  confirmPassHandler = e => this.setState({ confirmPass: e.target.value, err: false })

  toggleRemember = () => this.setState(prev => ({ remember: !prev.remember }))

  clearFields = () => {
    this.setState({
      email: '',
      pass: '',
      confirmPass: '',
      loading: false,
      err: false,
      errMsg: '',
      remember: false
    });
  }

  loginHandler = async (e) => {
    e.preventDefault();
    // return if already trying to login
    if (this.state.loading) { return; }
    // return if login form is invalid
    const validity = validate('login', this.state.email, this.state.pass);
    if (validity !== '') { return this.authFailed(validity); }
    // show spinner if loading
    this.toggleLoading();
    const userData = { email: this.state.email, password: this.state.pass,
      remember: this.state.remember };
    try {
      const res = await axios.post('login', userData);
      this.successHandler(res, userData);
    } catch(err) {
      if (err.response) { return this.authFailed(err.response.data.msg); }
      this.authFailed('There was an error logging in.');
    }
  }

  signupHandler = async (e) => {
    e.preventDefault();
    if (this.state.loading) { return; }
    // return if signup form is invalid
    const validity = validate('signup', this.state.email, this.state.pass, this.state.confirmPass);
    if (validity !== '') { return this.authFailed(validity); }
    this.toggleLoading();
    const userData = { email: this.state.email, password: this.state.pass,
      confirmPassword: this.state.confirmPass, remember: this.state.remember };
    try {
      const res = await axios.post('signup', userData);
      this.successHandler(res, userData);
    } catch(err) {
      if (err.response) { return this.authFailed(err.response.data.msg); }
      this.authFailed('There was an error signing up');
    }
  }

  successHandler = (res, userData) => {
    localStorage['token'] = res.data.token;
    if (userData.remember) {
      // expires in 7 days
      localStorage['expirationDate'] = new Date(new Date().getTime() + 604800000);
      localStorage['expirationTime'] = '604800000';
    } else {
      // expires in 3hr
      localStorage['expirationDate'] = new Date(new Date().getTime() + 10800000);
      localStorage['expirationTime'] = '10800000';
    }
    instance.defaults.headers.common['x-auth-token'] = res.data.token;
    localStorage['email'] = userData.email;
    this.clearFields();
    this.props.isAuth();
  }

  render() {
    return (
      <div className={classes.Container}>
        <div className={classes.InnerContainer}>
          <div className={classes.FormContainer}>
            <p className={classes.Demo}>See a demo <Link to="/demo" onClick={this.clearFields}>here</Link></p>
            <h1 className={this.props.login ? classes.LoginHeader : classes.SignupHeader}>Notely</h1>
            <div className={classes.Form}>
              <input placeholder="Email" value={this.state.email} onChange={this.emailHandler} />
              <input type="password" placeholder="Password" value={this.state.pass} onChange={this.passHandler} />
              {!this.props.login &&
              <input type="password" placeholder="Confirm Password" value={this.state.confirmPass} onChange={this.confirmPassHandler} /> }
            </div>
            <p className={this.state.err ? (this.props.login ? classes.LoginErrMsg : classes.SignupErrMsg) :
              (this.props.login ? classes.LoginHideErrMsg : classes.SignupHideErrMsg)}>{this.state.errMsg}</p>
            <div className={this.state.err ? [classes.Move, classes.FormBottom].join(' ') : classes.FormBottom}>
              <button className={classes.LoginBtn} onClick={this.props.login ? this.loginHandler : this.signupHandler}>
                {this.props.login ? 'login' : 'create'}
              </button>
              <div className={classes.Remember}>
                <input type="checkbox" onChange={this.toggleRemember} checked={this.state.remember}/>
                <p>Remember me</p>
              </div>
            </div>
            {this.state.loading && <Spinner auth />}
            <p className={classes.Link}>{this.props.login ? 'Not registered? ' : 'Already registered? '}
              <Link to={this.props.login? '/signup' : '/login'} onClick={this.clearFields}>{this.props.login ? 'Create an account' : 'Login'}</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
