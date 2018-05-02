import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import moment from 'moment';

import { ScrollView } from '@shoutem/ui';
import { TouchableOpacity } from '@shoutem/ui';
import { View, Screen, ListView } from '@shoutem/ui';
import { Title, Icon, Text, Button } from '@shoutem/ui';
import { Row, Tile, Subtitle, Caption } from '@shoutem/ui';

import Database from '../services/storage.js';
import { Actions } from 'react-native-router-flux';

import TotalDisplayBar from '../components/TotalDisplayBar';

class SubscriptionListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      subscriptions: []
    }
  };

  componentDidMount() {
    this.populateList();
  }

  populateList = () => {
    Database.getAllSubscriptions().then(list => {
      this.setState({subscriptions: list}, this.updateTotalDisplayBar);
    });
  };

  onSeeDetails = (subscription) => {
    Actions.subscription_detail({subscription: subscription});
  };

  updateTotalDisplayBar = () => {
    this.TotalDisplayBarChild.updateMonthsTotal(this.state.subscriptions);
  };

  isCurrentMonth(date) {
    date = new Date(date).getTime();
    let d = new Date();
    let startDate = (new Date(d.getFullYear(), d.getMonth(), 1)).getTime();
    let endDate = (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getTime();

    return (date <= endDate && date >= startDate) ? { color: 'red' } : {};
  }

  renderRow(subscription) {
    return (
      <TouchableOpacity key={subscription.id} onPress={() => this.onSeeDetails(subscription) }>      
        <Row>
          <Icon name="web" />
          <View styleName="vertical stretch space-between">
            <Subtitle>{subscription.title}</Subtitle>
            <Subtitle>{subscription.amount.symbol} {subscription.amount.price}</Subtitle>
            <Caption style={this.isCurrentMonth(subscription.due_date)}>
              Due on {subscription.due_date}
            </Caption>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      
      <View styleName="flexible">
        <ScrollView>
          <TotalDisplayBar onRef={ref => (this.TotalDisplayBarChild = ref)} />

          <Screen>
            <ListView
              data={this.state.subscriptions}
              renderRow={this.renderRow}
              onRefresh={this.populateList}
            />
          </Screen>

        </ScrollView>
      </View>
    );
  }
}

export default SubscriptionListScreen;
