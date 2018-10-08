import React, { Component } from 'react';

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
          drawerToggleClicked={this.sideDrawerToggleHander}/>
        <SideDrawer 
          closed={this.sideDrawerCloseHander} 
          open={this.state.showSideDrawer} />
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    );
  }
}

export default Layout;
