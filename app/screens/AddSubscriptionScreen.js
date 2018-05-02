import React, { Component } from 'react';
import { StatusBar, Alert } from 'react-native';
import { Permissions } from 'expo';

import moment from 'moment';
import { config } from '../config/config';
import FormSubscription from '../components/FormSubscription';

class AddNewSubscriptionScreen extends React.Component {

  render() {
    return (
      <FormSubscription 
        title=''
        price=''
        startDate={moment().format('MMMM DD, YYYY')}
        dueDate={moment().format('MMMM DD, YYYY')}
        notificationSwitch={true}
        repeatObject={config.repeatOptions[2]}
        navigation={this.props.navigation}
        isEdit={false}
      />
    );
  }

}

export default AddNewSubscriptionScreen;
