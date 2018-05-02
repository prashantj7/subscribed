import React, { Component } from 'react';
import { Permissions } from 'expo';
import moment from 'moment';

import { Alert } from 'react-native';
import { StatusBar } from 'react-native';

import { TouchableOpacity } from '@shoutem/ui';
import { Title, Icon, Text, Button } from '@shoutem/ui';
import { View, ScrollView, Row, Divider } from '@shoutem/ui';
import { TextInput, Switch, DropDownMenu } from '@shoutem/ui';

import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { config } from '../config/config';
import Database from '../services/storage.js';
import NotificationManager from '../services/notification.js';

class FormSubscription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      price: props.price,
      startDate: props.startDate,
      dueDate: props.dueDate,
      isStartDateTimePickerVisible: false,
      isDueDateTimePickerVisible: false,
      repeat: config.repeatOptions,
      switchOn: props.notificationSwitch,
      selectedRepeatOption: props.repeatObject
    };
  }

  componentWillMount() {
    if (!this.props.isEdit) {
      this.setDueDate();
    }
  }

  showListScreen = () => {
    Actions.reset('subscription_list');
  }

  save = () => {
    const item = {
      id: this.getRandomInt(1,10000),
      title: this.state.title,
      amount:{symbol: 'Rs.', price: this.state.price || 0},
      start_date: this.state.startDate,
      due_date: this.state.dueDate,
      repeat: this.state.selectedRepeatOption.value,
      notification: this.state.switchOn
    }
    Database.addSubscription(item);
    if (item.notification) {
      const timeEpoch = moment(item.due_date + ' 09:00:00', 'MMMM DD, YYYY HH:mm:ss').valueOf();

      NotificationManager.scheduleNotification(item.title, timeEpoch, item.repeat)
        .then(id => Database.updateSubscription(item.id, {notification_id: id}));
    }

    this.showListScreen();
  }

  deleteSubscription = () => {
    if (this.props.notificationId) { NotificationManager.cancelNotification(this.props.notificationId); }
    Database.removeSubscription(this.props.id);

    this.showListScreen();
  }

  _onNotificationSwitch = async (value) => {
    if (value) {
      const isPermitted = await NotificationManager.checkPermission();

      if (isPermitted) {
        this.setState({ switchOn: !this.state.switchOn });
      } else {

        const isGranted = await NotificationManager.askPermission();

        if (isGranted) { this.setState({ switchOn: !this.state.switchOn }); }
        else { 
          Alert.alert(
            'Notification are disabled',
            'Allow notifications for this app from Settings > Notifications > Subscribed',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            { cancelable: false }
          )
        }
      }

    } else {
      this.setState({ switchOn: !this.state.switchOn });
    } 
  }
  _onRepeatSelect = (option) => {
    this.setState({ selectedRepeatOption: option }, this.setDueDate);
  }

  _showStartDateTimePicker = () => this.setState({ isStartDateTimePickerVisible: true });
  _showDueDateTimePicker = () => this.setState({ isDueDateTimePickerVisible: true });

  _hideStartDateTimePicker = () => this.setState({ isStartDateTimePickerVisible: false });
  _hideDueDateTimePicker = () => this.setState({ isDueDateTimePickerVisible: false });

  _handleStartDatePicked = (date) => {
    this.setState({startDate: moment(date).format('MMMM DD, YYYY')}, this.setDueDate);
    this._hideStartDateTimePicker();
  };
  _handleDueDatePicked = (date) => {
    this.setState({dueDate: moment(date).format('MMMM DD, YYYY')});
    this._hideDueDateTimePicker();
  };

  setDueDate = () => {
    const repeatMode = this.state.selectedRepeatOption.value + 's';
    const dueDate = moment(this.state.startDate, 'MMMM DD, YYYY').add('1', repeatMode).format('MMMM DD, YYYY');
    this.setState({dueDate: dueDate});
  }

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  render() {
    const { switchOn } = this.state;

    const saveButton = <Button styleName="confirmation secondary" onPress={this.save}>
                        <Icon name="checkbox-on" />
                        <Text>SAVE</Text>
                       </Button>

    const deleteButton = <Button styleName="confirmation secondary" onPress={this.deleteSubscription}>
                        <Icon name="close" />
                        <Text>DELETE</Text>
                       </Button>
    
    const getButton = () => {
      return this.props.isEdit ? deleteButton : saveButton;
    }


    return (
      <View>
        <ScrollView>
          <Divider />

          <TextInput 
            returnKeyType='done'
            placeholder={'Subscription name'}
            onChangeText={(title) => this.setState({title})}
            value={this.state.title} />

          <TextInput
            returnKeyType='done'
            placeholder={'Amount'} 
            keyboardType="numeric"
            onChangeText={(price) => this.setState({price})}
            value={this.state.price} />

          <Divider />

          <TouchableOpacity onPress={this._showStartDateTimePicker}>
            <Row styleName="small">
              <Text>Subscription start date</Text>
              <Button onPress={this._showStartDateTimePicker} styleName="right-icon"><Text>{this.state.startDate}</Text></Button>
            </Row>
          </TouchableOpacity>

          <TouchableOpacity>
            <Row styleName="small">
              <Text>Repeat</Text>
              <DropDownMenu
                options={this.state.repeat}
                selectedOption={this.state.selectedRepeatOption}
                onOptionSelected={(option) => this._onRepeatSelect(option)}
                titleProperty="title"
                valueProperty="value"
              />
            </Row>
          </TouchableOpacity>


          <TouchableOpacity onPress={this._showDueDateTimePicker}>
            <Row styleName="small">
              <Text>Next due date</Text>
              <Button onPress={this._showDueDateTimePicker} styleName="right-icon"><Text>{this.state.dueDate}</Text></Button>
            </Row>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={this._onNotificationSwitch}>
            <Row styleName="small">
              <Text>Notification</Text>
              <Switch onValueChange={value => this._onNotificationSwitch(value)} value={switchOn} />
            </Row>
          </TouchableOpacity>

          <Divider />

          <View styleName="horizontal">
            {getButton()}
          </View>

          <DateTimePicker
            isVisible={this.state.isStartDateTimePickerVisible}
            onConfirm={this._handleStartDatePicked}
            onCancel={this._hideStartDateTimePicker}
          />
          <DateTimePicker
            date={moment(this.state.dueDate, 'MMMM DD, YYYY').toDate()}
            minimumDate={moment(this.state.startDate, 'MMMM DD, YYYY').toDate()}
            isVisible={this.state.isDueDateTimePickerVisible}
            onConfirm={this._handleDueDatePicked}
            onCancel={this._hideDueDateTimePicker}
          />

        </ScrollView>
      </View>
    );
  }
}

export default FormSubscription;
