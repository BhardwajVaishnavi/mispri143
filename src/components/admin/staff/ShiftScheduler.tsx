import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Input
} from '@chakra-ui/react';

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface Shift {
  id: string;
  staffId: string;
  startTime: Date;
  endTime: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export const ShiftScheduler = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const handleAddShift = async (shiftData: Omit<Shift, 'id'>) => {
    try {
      const response = await fetch('/api/staff/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shiftData),
      });

      if (!response.ok) throw new Error('Failed to add shift');

      const newShift = await response.json();
      setShifts([...shifts, newShift]);
      onClose();
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  return (
    <Box>
      <Button colorScheme="blue" onClick={onOpen} mb={4}>
        Add New Shift
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Staff Member</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {shifts.map((shift) => (
            <Tr key={shift.id}>
              <Td>{shift.staffId}</Td>
              <Td>{new Date(shift.startTime).toLocaleString()}</Td>
              <Td>{new Date(shift.endTime).toLocaleString()}</Td>
              <Td>{shift.status}</Td>
              <Td>
                <Button size="sm" colorScheme="red">
                  Cancel
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule New Shift</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Staff Member</FormLabel>
              <Select placeholder="Select staff member">
                {/* Staff options will be mapped here */}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Start Time</FormLabel>
              <Input type="datetime-local" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End Time</FormLabel>
              <Input type="datetime-local" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};