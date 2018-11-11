import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

  state = {
    showSideDrawer: false
  }

  sideDrawerCloseHander = () => {
    this.setState({showSideDrawer: false});
  }

  sideDrawerToggleHander = () => {
    this.setState( (prevState) => {
      return { showSideDrawer: !this.state.showSideDrawer };
    } );
  }

  render () {
    return (
      <Aux>
        <Toolbar 
          isAuth = {this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHander}/>
        <SideDrawer 
          isAuth = {this.props.isAuthenticated}
          closed={this.sideDrawerCloseHander} 
          open={this.state.showSideDrawer} />
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Layout);
