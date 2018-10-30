import React from 'react';
import { Redirect } from 'react-router-dom';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';

const checkoutSummary = (props) => {
  let burger = null;

  if ( props.ingredients ) {
    burger = <Burger ingredients={props.ingredients} />;
  } else {
    burger = <Redirect to="/" />
  }

  return (
    <div className={classes.CheckoutSummary}>
      <h1>We hope it tastes great!</h1>
      <div style={{width: '100%', margin: 'auto'}}>
        {burger}
      </div>
      <Button 
        clicked={props.checkoutCancelled}      
        btnType="Danger">CANCEL</Button>
      <Button 
        clicked={props.checkoutContinued}              
        btnType="Success">CONTINUE</Button>
    </div>
  );
}

export default checkoutSummary;
