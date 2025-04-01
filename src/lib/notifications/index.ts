interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  metadata?: Record<string, any>;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  // Implement your notification logic here
  console.log('Sending notification:', payload);
}