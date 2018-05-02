import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { config } from '../config/config';
import FormSubscription from '../components/FormSubscription';

import { Actions } from 'react-native-router-flux';

class SubscriptionDetail extends React.Component {

  findRepeatObject = (repeatMode) => {
    return config.repeatOptions.find(item => item.value == repeatMode);
  }

  render() {
    const subscription = Actions.currentParams.subscription;

    return (
      <FormSubscription
        id={subscription.id}
        notificationId={subscription.notification_id}
        title={subscription.title}
        price={subscription.amount.price}
        startDate={subscription.start_date}
        dueDate={subscription.due_date}
        notificationSwitch={subscription.notification}
        repeatObject={this.findRepeatObject(subscription.repeat)}
        navigation={this.props.navigation}
        isEdit={true}
      />
    );
  }
}

export default SubscriptionDetail;
