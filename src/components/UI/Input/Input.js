import React from 'react';
import classes from './Input.css';

const input = ( props ) => {
  let inputElement = null;
  let validationError = null;
  const inputClasses = [classes.Input];
  
  if ( props.invalid && props.shouldValidate && props.touched ) {
    inputClasses.push(classes.Invalid);
    validationError = <p className={classes.ValidationError}>Please enter a valid value for '{props.elementConfig.placeholder.toLowerCase()}'</p>;
  }

  switch(props.elementType) {
    case ('input'):
      inputClasses.push(classes.InputElement);
      inputElement = <input 
        className={inputClasses.join(' ')} 
        {...props.elementConfig}
        onChange={props.changed} 
        value={props.value}/>
      break;
    case ('textarea'):
      inputElement = <textArea 
        className={inputClasses.join(' ')} 
        {...props.elementConfig} 
        onChange={props.changed} 
        value={props.value}/>
      break;
    case ('select'):
      inputElement = (
        <select className={inputClasses.join(' ')} value={props.value} onChange={props.changed}>
          {props.elementConfig.options.map(option => {
           return ( <option key={option.displayValue} value={option.value} label={option.displayValue}></option> );
          })}
        </select>
      );
      break;
    default:
      inputElement = <input 
        className={inputClasses.join(' ')} 
        {...props.elementConfig} 
        onChange={props.changed} 
        value={props.value}/>
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>
        {props.label}
      </label>
      {inputElement}
      {validationError}
    </div>
  )
}

export default input;

