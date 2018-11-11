import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  }
}

export const authFail = (error) => {

  const errorHumanReadable = {
    'INVALID_EMAIL': 'Please enter a valid email',
    'INVALID_PASSWORD': 'Wrong passord, fool. Please check it and try again.',
    'EMAIL_EXISTS': 'This email already exists, fool.',
    'WEAK_PASSWORD': 'Please enter a valid password. Password should be at least 6 characters long.',
    'EMAIL_NOT_FOUND': 'This email does not exist as a user. Please check your email address.',
    'USER_DISABLED': 'This user has been disabled.'
  };

  let errorMessage = 'Hmm... check your details and try again.';

  for (let key in errorHumanReadable) {
    if (error.message.indexOf(key) !== -1 ) {
      errorMessage = errorHumanReadable[key];
    }
  };

  return {
    type: actionTypes.AUTH_FAIL,
    error: { message: '' + errorMessage }
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if ( !token ) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          dispatch(authSuccess(token, userId));
          const expirationDateDiff = ( expirationDate.getTime() - new Date().getTime() ) / 1000;
          dispatch(checkAuthTimeout(expirationDateDiff));
        }
      }
    }
  };
};

export const auth = (email, password, isSignup) => {
  let APIkey = 'AIzaSyBJZQEoYDKIbVdqGG04QPJOU8SF2RyU5pQ';
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
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        console.info(err.response);
        dispatch(authFail(err.response.data.error));
      });
  };
};
