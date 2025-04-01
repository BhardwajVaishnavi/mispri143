import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  useToast
} from '@chakra-ui/react';
import { useSocket } from '@/hooks/useSocket';

interface OrderStatus {
  orderId: string;
  status: string;
  location?: {
    lat: number;
    lng: number;
  };
  estimatedDeliveryTime?: Date;
}

export const OrderTracker = ({ orderId }: { orderId: string }) => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const socket = useSocket();
  const toast = useToast();

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-order-room', orderId);

    socket.on('order-status-update', (status: OrderStatus) => {
      setOrderStatus(status);
      toast({
        title: 'Order Status Updated',
        description: `Order ${orderId} is now ${status.status}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    });

    return () => {
      socket.emit('leave-order-room', orderId);
      socket.off('order-status-update');
    };
  }, [socket, orderId]);

  const getProgressValue = (status: string) => {
    const stages = ['RECEIVED', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return ((stages.indexOf(status) + 1) / stages.length) * 100;
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            Order #{orderId}
          </Text>
          <Badge colorScheme={orderStatus?.status === 'DELIVERED' ? 'green' : 'blue'}>
            {orderStatus?.status}
          </Badge>
        </HStack>

        <Progress
          value={orderStatus ? getProgressValue(orderStatus.status) : 0}
          size="sm"
          colorScheme="blue"
        />

        {orderStatus?.estimatedDeliveryTime && (
          <Text>
            Estimated Delivery: {new Date(orderStatus.estimatedDeliveryTime).toLocaleTimeString()}
          </Text>
        )}

        {orderStatus?.location && (
          <Box h="200px" borderRadius="md">
            {/* Integrate with Google Maps Component */}
          </Box>
        )}
      </VStack>
    </Box>
  );
};