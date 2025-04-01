import { io, Socket } from 'socket.io-client';

export class WebSocketService {
  private static socket: Socket | null = null;
  private static subscribers: Map<string, Set<(data: any) => void>> = new Map();

  static initialize() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('analytics_update', (data) => {
      this.notifySubscribers('analytics', data);
    });

    this.socket.on('report_status', (data) => {
      this.notifySubscribers('report_status', data);
    });
  }

  static subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)?.add(callback);
  }

  static unsubscribe(event: string, callback: (data: any) => void) {
    this.subscribers.get(event)?.delete(callback);
  }

  private static notifySubscribers(event: string, data: any) {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }
}