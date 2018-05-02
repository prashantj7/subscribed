import React from 'react';

import { View, Text, Icon } from '@shoutem/ui';
import { Router, Scene } from 'react-native-router-flux';

import AddSubscriptionScreen from '../screens/AddSubscriptionScreen';
import SubscriptionListScreen from '../screens/SubscriptionListScreen';
import SubscriptionDetailScreen from '../screens/SubscriptionDetailScreen'

import HomeNavBar from '../components/nav/HomeNavBar';
import AddNavBar from '../components/nav/AddNavBar';
import EditNavBar from '../components/nav/EditNavBar';

const AddSubscription = () => ( <AddSubscriptionScreen /> );
const SubscriptionList = () => ( <SubscriptionListScreen /> );
const SubscriptionDetail = () => ( <SubscriptionDetailScreen /> );

const HomeNav = () => ( <HomeNavBar /> );
const AddNav = () => ( <AddNavBar /> );
const EditNav = () => ( <EditNavBar /> );

const Root = () => {
  return (
    <Router>
      <Scene key="root" modal hideNavBar>

        <Scene key="subscription_list">
          <Scene component={SubscriptionList} navBar={HomeNav} />
          <Scene key="subscription_detail" component={SubscriptionDetail} navBar={EditNav} />
        </Scene>

        <Scene key="subscription_add">
          <Scene direction="vertical" component={AddSubscription} navBar={AddNav} />
        </Scene>

      </Scene>
    </Router>
  );
}

export default Root;
