import React, { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  Text,
  Radio,
  RadioGroup,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface PaymentProcessorProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

export const PaymentProcessor = ({ amount, orderId, onSuccess }: PaymentProcessorProps) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      if (paymentMethod === 'card') {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-confirmation`,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        await processOrder(paymentIntent?.id);
      } else {
        await processOrder('cash-payment');
      }

      onSuccess();
      toast({
        title: 'Payment Successful',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const processOrder = async (paymentId: string) => {
    const response = await fetch('/api/pos/process-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        paymentMethod,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process order');
    }
  };

  return (
    <Box>
      <Button colorScheme="blue" onClick={onOpen} isLoading={isProcessing}>
        Process Payment
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Details</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="xl">Total: ₹{amount.toFixed(2)}</Text>
              
              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <VStack align="start">
                  <Radio value="card">Card Payment</Radio>
                  <Radio value="cash">Cash Payment</Radio>
                </VStack>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <Box p={4} borderWidth="1px" borderRadius="md" w="full">
                  <CardElement />
                </Box>
              )}

              {paymentMethod === 'cash' && (
                <Input
                  placeholder="Amount Received"
                  type="number"
                  min={amount}
                />
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handlePayment} isLoading={isProcessing}>
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};