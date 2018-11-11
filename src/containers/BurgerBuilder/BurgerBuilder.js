import React, { Component } from 'react';
import axios from '../../axios-orders';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

  state = {
    purchasing: false,
  }

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState = ( ingredients ) => {
    const sum = Object.keys(ingredients)
      .map( ingredientsKey => {
        return ingredients[ingredientsKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
     
    return sum > 0;
  }

  purchaseHandler = () => {
    if ( this.props.isAuthenticated ) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  }

  purchaseCancelHander = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchased();
    this.props.history.push('/checkout');
  }

  render () {

    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.props.error ? <p style={{textAlign: 'center'}}>Oh no! Ingredients could not load!</p> : <Spinner />;

    if ( this.props.ings ) {
      burger = (
          <Aux>
            <Burger ingredients={this.props.ings} />
            <BuildControls 
              ingredientAdded={this.props.onIngredientAdded} 
              ingredientRemoved={this.props.onIngredientRemove} 
              disabled={disabledInfo}
              price={this.props.price}
              purchasable={this.updatePurchaseState(this.props.ings)}
              purchasing={this.purchaseHandler}
              isAuth={this.props.isAuthenticated}/>
          </Aux>
      );

      orderSummary = <OrderSummary 
            ingredients={this.props.ings} 
            purchaseCancelled={this.purchaseCancelHander}
            purchaseContinue={this.purchaseContinueHandler}
            price={this.props.price}/>;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHander}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: (ingName) => dispatch(actions.initIngredients()),
    onInitPurchased: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
