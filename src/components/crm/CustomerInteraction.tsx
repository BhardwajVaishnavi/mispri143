import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';

interface Interaction {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'SUPPORT';
  notes: string;
  createdAt: Date;
  createdBy: string;
}

interface CustomerInteractionProps {
  customerId: string;
}

export const CustomerInteraction = ({ customerId }: CustomerInteractionProps) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [newInteraction, setNewInteraction] = useState({
    type: 'CALL',
    notes: '',
  });
  const toast = useToast();

  const handleAddInteraction = async () => {
    try {
      const response = await fetch('/api/crm/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          ...newInteraction,
        }),
      });

      if (!response.ok) throw new Error('Failed to add interaction');

      const data = await response.json();
      setInteractions([data, ...interactions]);
      setNewInteraction({ type: 'CALL', notes: '' });

      toast({
        title: 'Interaction Added',
        status: 'success',
        duration: 3000,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            New Interaction
          </Text>
          <VStack spacing={3}>
            <Select
              value={newInteraction.type}
              onChange={(e) => setNewInteraction({
                ...newInteraction,
                type: e.target.value as Interaction['type']
              })}
            >
              <option value="CALL">Phone Call</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Meeting</option>
              <option value="SUPPORT">Support</option>
            </Select>
            <Textarea
              value={newInteraction.notes}
              onChange={(e) => setNewInteraction({
                ...newInteraction,
                notes: e.target.value
              })}
              placeholder="Interaction notes..."
            />
            <Button colorScheme="blue" onClick={handleAddInteraction}>
              Add Interaction
            </Button>
          </VStack>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Interaction History
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Notes</Th>
                <Th>Staff</Th>
              </Tr>
            </Thead>
            <Tbody>
              {interactions.map((interaction) => (
                <Tr key={interaction.id}>
                  <Td>{new Date(interaction.createdAt).toLocaleDateString()}</Td>
                  <Td>{interaction.type}</Td>
                  <Td>{interaction.notes}</Td>
                  <Td>{interaction.createdBy}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};
