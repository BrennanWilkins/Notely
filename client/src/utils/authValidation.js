export const validate = (mode, email, pass, confirmPass) => {
  // check if email input is a valid email
  const emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.length === 0 || pass.length === 0) {
    return 'Email and password must not be empty.';
  }
  if (!emailTest.test(email)) {
    return 'Please enter a valid email.';
  }
  if (mode === 'signup') {
    if (pass.length > 70) {
      return 'Password must be less than 70 characters.';
    }
    if (pass.length < 7) {
      return 'Password must be at least 7 characters long.';
    }
    if (pass !== confirmPass) {
      return 'Confirm password must be equal to password.';
    }
  }
  return '';
};
