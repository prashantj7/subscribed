import { Notifications, Permissions, Constants } from 'expo';
import moment from 'moment';

const NotificationManager = {

  scheduleNotification: (subscriptionTitle, epoch, repeat) => {
    const localNotification = {
      title: 'Subscribed',
      body: subscriptionTitle + ' is due today.',
    }

    const schedulingOptions = {
      repeat: repeat,
      time: epoch
    }

    return Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
  },

  checkPermission: async function () {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    return (status == 'granted') ? true : false;
  },

  askPermission: async function () {
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    return (Constants.isDevice && result.status === 'granted') ? true : false;
  },

  cancelNotification: function(notificationId) {
    Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
export default NotificationManager;