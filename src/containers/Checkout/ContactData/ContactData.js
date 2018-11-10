import React, { Component } from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
  state = {
    formIsValid: false,
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          touched: false
        }
      },
      street:  {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your street',
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          touched: false
        }
      },
      zip:  {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Zipcode',
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          minLength: 5,
          maxLength: 5,
          touched: false
        }
      },
      country:  {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          touched: false
        }
      },
      email:  {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email',
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          touched: false
        }
      },
      deliveryMethod:  {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: 'fastest',
        validation: {
          valid: true
        }
      }
    }
  }

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};

    for ( let formElementIndentifier in this.state.orderForm ) {
      formData[formElementIndentifier] = this.state.orderForm[formElementIndentifier].value;
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData
    }

    this.props.onOrderBurger(order);
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    updatedFormElement.value = event.target.value;
    updatedFormElement.validation.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.validation.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for ( let inputIdentifier in updatedOrderForm ) {
      formIsValid = updatedOrderForm[inputIdentifier].validation.valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
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

    return isValid;
  }

  render () {
    const formElementsArray = [];
    for ( let key in this.state.orderForm ) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map( formElement => (
          <Input 
            key={formElement.id}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            invalid={!formElement.config.validation.valid}
            shouldValidate={formElement.config.validation.required}
            touched={formElement.config.validation.touched}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );

    if ( this.props.loading ) {
      form = <Spinner />
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( ContactData, axios ));
