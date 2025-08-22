export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'news';
  newsId?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: AppNotification[] = [];
  private listeners: ((notifications: AppNotification[]) => void)[] = [];
  private lastNewsCheck: string | null = null;
  private lastKnownNewsIds: Set<string> = new Set();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  initialize() {
    // Only initialize if not already initialized
    if (this.notifications.length === 0 && this.lastKnownNewsIds.size === 0) {
      this.notifications = [];
      this.lastNewsCheck = new Date().toISOString();
    }
  }

  checkForNewNews(newsItems: any[]) {
    if (!newsItems || newsItems.length === 0) return;

    // Find news items we haven't seen before
    const newNews = newsItems.filter(item => !this.lastKnownNewsIds.has(item.id));

    // Create notifications for new news items
    if (newNews.length > 0) {
      console.log('Found new news items:', newNews.length);
      for (const news of newNews) {
        console.log('Creating notification for:', news.title);
        this.addNotification({
          id: `news_${news.id}_${Date.now()}`,
          title: 'New Health News Available',
          message: `${news.title.substring(0, 80)}${news.title.length > 80 ? '...' : ''}`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'news',
          newsId: news.id
        });
      }
    }

    // Update known news IDs for future comparisons
    newsItems.forEach(item => this.lastKnownNewsIds.add(item.id));
    this.lastNewsCheck = new Date().toISOString();
  }

  addNotification(notification: AppNotification) {
    console.log('Adding notification:', notification.title);
    this.notifications.unshift(notification);
    console.log('Total notifications:', this.notifications.length);
    this.notifyListeners();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(listener: (notifications: AppNotification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Add health alerts
  addHealthAlert(title: string, message: string, type: 'warning' | 'info' | 'success' = 'warning') {
    this.addNotification({
      id: `alert_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    });
  }
}

export const notificationService = NotificationService.getInstance();
