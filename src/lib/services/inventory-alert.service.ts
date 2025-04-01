import prisma from '@/lib/prisma';
import { Prisma, AlertType } from '@prisma/client';
import { DateTime } from 'luxon';
import { sendNotification } from '@/lib/notifications';
import { createId } from '@paralleldrive/cuid2';

// Define a custom severity type since it's not in the Prisma schema
type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export class InventoryAlertService {
  static async checkAndCreateAlerts(
    tx: Prisma.TransactionClient,
    inventory: any,
    movement?: any
  ) {
    const alerts: Array<{
      type: AlertType;
      message: string;
      severity: AlertSeverity;
      metadata?: Record<string, any>;
    }> = [];

    // Stock level alerts
    if (inventory.quantity <= 0) {
      alerts.push({
        type: 'OUT_OF_STOCK',
        message: `${inventory.product.name} is out of stock at ${inventory.store.name}`,
        severity: 'HIGH',
        metadata: {
          productId: inventory.productId,
          storeId: inventory.storeId,
        },
      });
    } else if (inventory.quantity <= inventory.minimumStock) {
      alerts.push({
        type: 'LOW_STOCK',
        message: `${inventory.product.name} is running low at ${inventory.store.name}`,
        severity: 'MEDIUM',
        metadata: {
          productId: inventory.productId,
          storeId: inventory.storeId,
          currentStock: inventory.quantity,
          minimumStock: inventory.minimumStock,
        },
      });
    }

    // Expiration alerts
    if (inventory.expiryDate) {
      const daysToExpiry = Math.ceil(
        DateTime.fromJSDate(inventory.expiryDate)
          .diffNow('days')
          .days
      );

      if (daysToExpiry <= 0) {
        alerts.push({
          type: 'EXPIRED',
          message: `${inventory.product.name} has expired`,
          severity: 'HIGH',
          metadata: {
            productId: inventory.productId,
            storeId: inventory.storeId,
            expiryDate: inventory.expiryDate,
          },
        });
      } else if (daysToExpiry <= 30) {
        alerts.push({
          type: 'EXPIRING_SOON',
          message: `${inventory.product.name} will expire in ${daysToExpiry} days`,
          severity: 'MEDIUM',
          metadata: {
            productId: inventory.productId,
            storeId: inventory.storeId,
            expiryDate: inventory.expiryDate,
            daysToExpiry,
          },
        });
      }
    }

    // Unusual movement alerts
    if (movement) {
      const averageMovement = await this.getAverageMovement(
        inventory.productId,
        inventory.storeId
      );

      if (movement.quantity > averageMovement * 2) {
        alerts.push({
          type: 'OVER_STOCK',
          message: `Unusual movement detected for ${inventory.product.name}`,
          severity: 'LOW',
          metadata: {
            productId: inventory.productId,
            storeId: inventory.storeId,
            movementQuantity: movement.quantity,
            averageMovement,
          },
        });
      }
    }

    // Create alerts and send notifications
    for (const alert of alerts) {
      // Create alert with only the fields that exist in your schema
      await tx.inventoryAlert.create({
        data: {
          id: createId(),
          inventoryId: inventory.id,
          type: alert.type,
          message: alert.message,
          isRead: false,
        },
      });

      // Store the severity and metadata in the notes field of inventory
      // if they contain important information
      if (alert.severity === 'HIGH') {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            notes: `ALERT (${alert.type}): ${alert.message} - Severity: ${alert.severity}`
          }
        });
      }

      await this.sendAlertNotifications(alert, inventory);
    }

    return alerts;
  }

  private static async getAverageMovement(
    productId: string,
    storeId: string
  ): Promise<number> {
    const movements = await prisma.stockMovement.findMany({
      where: {
        inventory: {
          productId,
          storeId,
        },
        date: {
          gte: DateTime.now().minus({ days: 30 }).toJSDate(),
        },
      },
    });

    if (movements.length === 0) return 0;

    return movements.reduce((sum, m) => sum + Math.abs(m.quantity), 0) / movements.length;
  }

  private static async sendAlertNotifications(alert: any, inventory: any) {
    // Define a type for the user data
    interface UserData {
      id: string;
      name?: string;
      email?: string;
      role: string;
    }

    // Use raw SQL to bypass the TypeScript error with UserStore relation
    const users = await prisma.$queryRaw<UserData[]>`
      SELECT u.* 
      FROM "User" u
      JOIN "UserStore" us ON u.id = us."userId"
      WHERE us."storeId" = ${inventory.storeId}
      AND u.role IN ('STORE_ADMIN', 'STAFF')
    `;

    for (const user of users) {
      await sendNotification({
        userId: user.id,
        title: `Inventory Alert: ${alert.type}`,
        message: alert.message,
        severity: alert.severity,
        metadata: {
          ...alert.metadata,
          alertType: alert.type,
        },
      });
    }
  }
}