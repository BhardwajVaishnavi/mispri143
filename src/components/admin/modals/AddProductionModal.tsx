import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';

interface AddProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductionModal: React.FC<AddProductionModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Production Batch</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Product</FormLabel>
              <Select placeholder="Select product">
                <option>Chocolate Cake</option>
                <option>Vanilla Cake</option>
                <option>Red Velvet Cake</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Quantity</FormLabel>
              <NumberInput min={1}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input type="datetime-local" />
            </FormControl>

            <FormControl>
              <FormLabel>Expected Completion</FormLabel>
              <Input type="datetime-local" />
            </FormControl>

            <FormControl>
              <FormLabel>Assigned Staff</FormLabel>
              <Select placeholder="Select staff">
                <option>John Doe</option>
                <option>Jane Smith</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Create Batch</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductionModal;