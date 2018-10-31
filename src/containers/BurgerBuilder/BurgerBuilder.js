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
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {

  state = {
    // ingredients: null,
    // totalPrice: 4,
    // purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    axios.get('https://react-burger-builder-85241.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState( {ingredients: response.data} );
      })
      .catch(error => {
        this.setState( {error: true} );
      });
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

  // addIngredientsHandler = ( type ) => {
  //   const oldCount = this.props.ings[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = {
  //     ...this.props.ings
  //   };
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  //   this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
  //   this.updatePurchaseState(updatedIngredients);
  // }

  // removeIngredientsHandler = ( type ) => {
  //   const oldCount = this.props.ings[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {
  //     ...this.props.ings
  //   };
  //   updatedIngredients[type] = updatedCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceDeduction;
  //   this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
  //   this.updatePurchaseState(updatedIngredients);
  // }

  purchaseHander = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHander = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    // ONE METHOD OF MAKING QUERYSTRING
    // const ingredientsState = {...this.state.ingredients};
    // var queryString = Object.keys(ingredientsState).map(key => key + '=' + ingredientsState[key]).join('&');
    // queryString = queryString + '&price=' + this.state.totalPrice;

    // // ANOTHER METHOD OF MAKING QUERYSTRING
    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    // }
    // queryParams.push('price=' + this.state.totalPrice);
    // const queryString = queryParams.join('&');

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
    let burger = this.state.error ? <p style={{textAlign: 'center'}}>Oh no! Ingredients could not load!</p> : <Spinner />;

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
              purchasing={this.purchaseHander}/>
          </Aux>
      );

      orderSummary = <OrderSummary 
            ingredients={this.props.ings} 
            purchaseCancelled={this.purchaseCancelHander} 
            purchaseContinue={this.purchaseContinueHandler}
            price={this.props.price}/>;
    }

    if ( this.state.loading ) {
      orderSummary = <Spinner />
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
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemove: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
