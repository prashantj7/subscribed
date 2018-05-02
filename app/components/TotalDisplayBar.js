import React, { Component } from 'react';
import moment from 'moment';

import { View, Tile, Caption, Subtitle } from '@shoutem/ui';
import { config } from '../config/config';

class TotalDisplayBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pastMonthTotal: 0,
      currentMonthTotal: 0,
      nextMonthTotal: 0
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  updateMonthsTotal = (subscriptions) => {

    isDateInLastMonth = (date) => {
      let d = new Date();
      let startDate = (new Date(d.getFullYear(), d.getMonth() - 1, 1)).getTime();
      let endDate = (new Date(d.getFullYear(), d.getMonth(), 0)).getTime();

      return (date <= endDate && date >= startDate);
    };

    isDateInCurrentMonth = (date) => {
      let d = new Date();
      let startDate = (new Date(d.getFullYear(), d.getMonth(), 1)).getTime();
      let endDate = (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getTime();

      return (date <= endDate && date >= startDate);
    };

    isDateInNextMonth = (date) => {
      let d = new Date();
      let startDate = (new Date(d.getFullYear(), d.getMonth() + 1, 1)).getTime();
      let endDate = (new Date(d.getFullYear(), d.getMonth() + 2, 0)).getTime();

      return (date <= endDate && date >= startDate);
    };

    let pastMonthTotal = 0;
    let currentMonthTotal = 0;
    let nextMonthTotal = 0;
    

    subscriptions.forEach(function(subscription) {
      var dueDate = moment(subscription.due_date, 'MMMM DD, YYYY').format('MMMM DD, YYYY');
      dueDate = new Date(dueDate).getTime();

      if (isDateInLastMonth(dueDate)) {  pastMonthTotal += parseInt(subscription.amount.price); }
      else if (isDateInCurrentMonth(dueDate)) { currentMonthTotal += parseInt(subscription.amount.price); }
      else if (isDateInNextMonth(dueDate)) { nextMonthTotal += parseInt(subscription.amount.price); }
    });

    this.setState({
      pastMonthTotal: pastMonthTotal,
      currentMonthTotal: currentMonthTotal,
      nextMonthTotal: nextMonthTotal
    });
  };

  render() {

    return (
      <View styleName="horizontal flexible">
        <Tile styleName="text-centric">
          <Caption>Last month</Caption>
          <Subtitle style={{color: 'green'}}> ₹ {this.state.pastMonthTotal}</Subtitle>
        </Tile>
        <Tile styleName="text-centric">
          <Caption>This month</Caption>
          <Subtitle style={{ color: 'red' }}> ₹ {this.state.currentMonthTotal}</Subtitle>
        </Tile>
        <Tile styleName="text-centric">
          <Caption>Next month</Caption>
          <Subtitle> ₹ {this.state.nextMonthTotal}</Subtitle>
        </Tile>
      </View>
    );
  }
}

export default TotalDisplayBar;
