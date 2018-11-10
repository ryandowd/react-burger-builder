import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';

import classes from './Auth.css';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email address',
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
          valid: false,
          touched: false
        }
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password',
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
          valid: false,
          touched: false
        }
      }
    },
    isSignup: true
  }

  checkValidity( value, rules ) {
    let isValid = true;

    if ( rules.required ) {
      isValid = value.trim() !== '' && isValid;
    }

    if ( rules.minLength ) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if ( rules.maxLength ) {
      isValid = value.length <= rules.maxLength && isValid;
    }

     if ( rules.isEmail ) {
      const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      isValid = emailRegex.test(value);
    }

    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        validation: {
          ...this.state.controls[controlName].validation,
          valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
          touched: true
        }
      }
    };

    this.setState({controls:updatedControls});
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {isSignup: !prevState.isSignup}
    })
  }

  render () {
    const formElementsArray = [];
    for ( let key in this.state.controls ) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      })
    }

    const form = formElementsArray.map(formElement => (
      <Input 
        key={formElement.id}
        elementType={formElement.config.elementType} 
        elementConfig={formElement.config.elementConfig} 
        invalid={!formElement.config.validation.valid}
        shouldValidate={formElement.config.validation.required}
        touched={formElement.config.validation.touched}
        value={formElement.config.value}
        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
    ));

    return (
      <div className={classes.Auth}>
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">Submit</Button>
        </form>
        <Button 
            clicked={this.switchAuthModeHandler}
            btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup))
  }
};

export default connect(null, mapDispatchToProps)(Auth);
