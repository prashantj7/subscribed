import { AsyncStorage } from 'react-native';

import { dummySubscription } from '../config/data';

async function setItem(key, item) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
};

async function getItem(key) {
  try {
    const response = await AsyncStorage.getItem(key);
    return await JSON.parse(response);
  } catch (error) {
    console.log(error);
  }
};

async function foo(stores) {
  var items = [];
  stores.map((result, i, store) => {
    let key = store[i][0];
    let value = store[i][1];
    items.push(JSON.parse(value));
  });
  return await items;
}

async function getAllItems() {
  return new Promise((resolve, reject) => {
    var items = [];
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, async (err, stores) => {
        const items = await foo(stores);
        resolve(items);
      });
    }); 
  });
}

const listOfSubscriptions = [];

const Database = {
  addSubscription: async function(newItem) {
    var key = '@Subscribed:' + newItem.id;
    setItem(key, newItem);
  },
  getSubscription: async function(id) {
    var key = '@Subscribed:' + id;
    return await getItem(key);
  },
  getAllSubscriptions: async function() {
    const listOfSubscriptions = await getAllItems();
    console.log(listOfSubscriptions);
    return listOfSubscriptions
  },
  findSubscription: function(id) {
    
  },
  updateSubscription: async function(id, updateObj) {
    var key = '@Subscribed:' + id;
    var value = JSON.stringify(updateObj);
    AsyncStorage.mergeItem(key, value);
  },
  removeSubscription: function(id) {
    var key = '@Subscribed:' + id;
    AsyncStorage.removeItem(key, error => console.log(error));
  }
};

export default Database;