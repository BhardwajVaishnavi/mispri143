import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { period = 'monthly', startDate, endDate } = req.query;

    try {
      const transactions = await prisma.order.groupBy({
        by: ['createdAt'],
        _sum: {
          totalAmount: true
        },
        where: {
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          },
          status: 'COMPLETED'
        }
      });

      const stats = await prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        _avg: {
          totalAmount: true
        },
        _count: true,
        where: {
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          }
        }
      });

      return res.status(200).json({
        transactions,
        stats,
        period
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch financial data' });
    }
  }
}