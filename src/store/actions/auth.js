import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData: authData
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const auth = (email, password, isSignup) => {
  let APIkey = 'AIzaSyBJZQEoYDKIbVdqGG04QPJOU8SF2RyU5pQ';
  console.info('blah');
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=';
    if (!isSignup) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=';
    }

    axios.post(url + APIkey, authData)
      .then(response => {
        console.info(response);
        dispatch(authSuccess(response.data));
      })
      .catch(err => {
        console.info(err);
        dispatch(authFail(err));
      });
  };
};
