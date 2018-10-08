import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  render () {
    const ingredientSummary = Object.keys(this.props.ingredients)
      .map( ingredientsKey => {
        return (
          <li key={ingredientsKey}>
            <span style={{textTransform: 'capitalize'}}>{ingredientsKey}</span> : {this.props.ingredients[ingredientsKey]}
          </li>
        );
      });
    return (
      <Aux>
        <h3>Your Order</h3>
        <p>Delicious burger with the following ingredients</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue to checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
        <Button btnType="Success" clicked={this.props.purchaseContinue}>CONTINUE</Button>
      </Aux>
    );
  }
}

export default OrderSummary;
