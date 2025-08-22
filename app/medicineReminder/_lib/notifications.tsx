import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { database } from './database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Minimal default export so Expo Router doesn't treat this as a missing route.
// Does not render anything and does not affect the library usage above.
export default function NotificationsLibRoutePlaceholder() {
  return null;
}

export async function requestPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Medicine Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
}

export async function cancelNotification(id: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log(`Cancelled notification: ${id}`);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all notifications');
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

export async function scheduleNotification(
  id: string,
  title: string,
  body: string,
  time: string
) {
  try {
    // Cancel any existing notification with the same ID first
    await cancelNotification(id);

    // Validate time format
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(time)) {
      throw new Error(`Invalid time format: ${time}`);
    }

    const [hours, minutes] = time.split(':').map(Number);

    // Create the exact date and time for the notification
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime.getTime() <= now.getTime()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    console.log(`Scheduling notification "${id}" for ${scheduledTime.toLocaleString()}`);

    // Use the correct trigger type - this eliminates the TypeScript error
    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledTime,
    };

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title,
        body,
        sound: 'default',
        data: {
          planId: id.replace('plan_', ''),
          originalTime: time,
          scheduledFor: scheduledTime.toISOString(),
        },
      },
      trigger,
    });

    console.log(`Notification scheduled successfully: ${notificationId}`);

    // Schedule the next occurrence for tomorrow (for daily repetition)
    await scheduleNextOccurrence(id, title, body, time, scheduledTime);

    return notificationId;

  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

// Internal function to schedule the next day's notification
async function scheduleNextOccurrence(
  id: string,
  title: string,
  body: string,
  time: string,
  currentDate: Date
) {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(hours, minutes, 0, 0);

    const nextDayId = `${id}_next`;

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: nextDay,
    };

    await Notifications.scheduleNotificationAsync({
      identifier: nextDayId,
      content: {
        title,
        body,
        sound: 'default',
        data: {
          planId: id.replace('plan_', ''),
          originalTime: time,
          isNextDay: true,
          scheduledFor: nextDay.toISOString(),
        },
      },
      trigger,
    });

    console.log(`Next occurrence scheduled for: ${nextDay.toLocaleString()}`);
  } catch (error) {
    console.error('Error scheduling next occurrence:', error);
  }
}

// Get all scheduled notifications for debugging
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`Total scheduled notifications: ${notifications.length}`);
    notifications.forEach((notification, index) => {
      console.log(`${index + 1}. ID: ${notification.identifier}`);
      if (notification.trigger && 'date' in notification.trigger) {
        console.log(`   Scheduled for: ${new Date(notification.trigger.date).toLocaleString()}`);
      }
    });
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

// Process daily medication updates
export async function processDailyMedicationUpdates() {
  try {
    const plansNeedingUpdate = await database.getPlansNeedingUpdate();
    const today = new Date().toISOString().split('T')[0];

    for (const plan of plansNeedingUpdate) {
      if (plan.id) {
        // Decrement duration
        const newDuration = await database.decrementDuration(plan.id);

        // Update last notification date
        await database.updateLastNotificationDate(plan.id, today);

        console.log(`Updated plan ${plan.name}: ${newDuration} days remaining`);

        // If duration reached 0, cancel all notifications for this plan
        if (newDuration === 0) {
          await cancelNotification(`plan_${plan.id}`);
          await cancelNotification(`plan_${plan.id}_next`);
          console.log(`Completed medication plan: ${plan.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error processing daily medication updates:', error);
  }
}

// Set up notification response listener
export function setupNotificationResponseListener() {
  return Notifications.addNotificationResponseReceivedListener(async (response) => {
    try {
      const notificationId = response.notification.request.identifier;
      const notificationData = response.notification.request.content.data;

      console.log(`Notification tapped: ${notificationId}`);

      // Extract plan ID from notification identifier
      let planId: number | null = null;

      if (notificationId.startsWith('plan_')) {
        const idMatch = notificationId.match(/plan_(\d+)/);
        if (idMatch) {
          planId = parseInt(idMatch[1]);
        }
      }

      if (planId && notificationData) {
        const today = new Date().toISOString().split('T')[0];

        // Check if we've already processed this plan today
        const plansNeedingUpdate = await database.getPlansNeedingUpdate();
        const planNeedsUpdate = plansNeedingUpdate.find(p => p.id === planId);

        if (planNeedsUpdate) {
          // Decrement duration and update last notification date
          const newDuration = await database.decrementDuration(planId);
          await database.updateLastNotificationDate(planId, today);

          console.log(`Processed notification for plan ${planId}: ${newDuration} days remaining`);

          // If duration reached 0, cancel all related notifications
          if (newDuration === 0) {
            await cancelNotification(`plan_${planId}`);
            await cancelNotification(`plan_${planId}_next`);
            console.log(`Medication plan completed: ${planId}`);
          } else {
            // If this was a next-day notification, schedule the following day
            if (notificationData.isNextDay && notificationData.originalTime) {
              await scheduleNotification(
                `plan_${planId}`,
                'Medicine Reminder',
                `Time to take your ${planNeedsUpdate.name} (${planNeedsUpdate.dosage}) ${planNeedsUpdate.foodTiming} food`,
                notificationData.originalTime as string
              );
          }
        }
      }
    }
  } catch (error) {
    console.error('Error handling notification response:', error);
  }
});
}