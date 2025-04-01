import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
} from '@chakra-ui/react';

const InventoryStatus = () => {
  const inventory = [
    {
      item: 'All Purpose Flour',
      stock: 75,
      status: 'normal',
      reorderPoint: 20,
    },
    {
      item: 'Sugar',
      stock: 15,
      status: 'low',
      reorderPoint: 25,
    },
    {
      item: 'Cocoa Powder',
      stock: 45,
      status: 'normal',
      reorderPoint: 15,
    },
    {
      item: 'Butter',
      stock: 90,
      status: 'excess',
      reorderPoint: 30,
    },
    {
      item: 'Eggs',
      stock: 28,
      status: 'normal',
      reorderPoint: 24,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'low':
        return 'red';
      case 'normal':
        return 'green';
      case 'excess':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Heading size="md" mb={6}>Inventory Status</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Item</Th>
            <Th>Stock Level</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inventory.map((item) => (
            <Tr key={item.item}>
              <Td>{item.item}</Td>
              <Td>
                <Progress
                  value={(item.stock / (item.reorderPoint * 2)) * 100}
                  colorScheme={getStatusColor(item.status)}
                  size="sm"
                />
              </Td>
              <Td>
                <Badge colorScheme={getStatusColor(item.status)}>
                  {item.status.toUpperCase()}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default InventoryStatus;