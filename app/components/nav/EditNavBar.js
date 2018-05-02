import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { NavigationBar, Title, Text, Icon, Button } from '@shoutem/ui'
import { Actions } from 'react-native-router-flux';

class EditNavBar extends React.Component {

  dismiss = () => {
    Actions.pop();
  }

  render() {

    return (
      <NavigationBar
        styleName="inline"
        leftComponent={(
          <Button styleName="clear" onPress={this.dismiss}>
            <Icon name="left-arrow" />
            <Text>Back</Text>
          </Button>
        )}
        centerComponent={<Title>Details</Title>}
      />
    );
  }
}

export default EditNavBar;

