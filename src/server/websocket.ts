import { Server } from 'socket.io';
import { createServer } from 'http';
import { parse } from 'url';
import { NextApiRequest } from 'next';
import prisma from '@/lib/prisma';

export class WebSocketServer {
  private static io: Server;

  static initialize(httpServer: any) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('join-order-room', (orderId: string) => {
        socket.join(`order-${orderId}`);
      });

      socket.on('leave-order-room', (orderId: string) => {
        socket.leave(`order-${orderId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  static broadcastAnalyticsUpdate(data: any) {
    this.io.emit('analytics_update', data);
  }

  static broadcastReportStatus(reportId: string, status: string) {
    this.io.emit('report_status', { reportId, status });
  }

  static notifyOrderUpdate(orderId: string, status: string) {
    this.io.to(`order-${orderId}`).emit('order-status-update', { orderId, status });
  }
}