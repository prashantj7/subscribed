import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { NavigationBar, Title, Icon, Button } from '@shoutem/ui'
import { Actions } from 'react-native-router-flux';

class HomeNavBar extends React.Component {

  handleAddPress = () => {
    Actions.subscription_add();
  };

  render() {
    return (
      <NavigationBar 
        styleName="inline" 
        centerComponent={ <Title>Subscriptions</Title> } 
        rightComponent={ <Button onPress={this.handleAddPress}><Icon name="plus-button" /></Button> } 
       />
    );
  }
}

export default HomeNavBar;

