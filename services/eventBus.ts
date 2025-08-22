type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }

  off(event: string, callback?: EventCallback): void {
    if (!this.events[event]) return;
    
    if (callback) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    } else {
      delete this.events[event];
    }
  }
}

export const eventBus = new EventBus();

export const EVENTS = {
  DISCUSSION_CREATED: 'discussion_created',
  DISCUSSION_UPDATED: 'discussion_updated',
  DISCUSSION_DELETED: 'discussion_deleted',
  REPLY_CREATED: 'reply_created',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
} as const;
